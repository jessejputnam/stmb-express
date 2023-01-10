"use strict";

const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Page = require("../models/page");
const Post = require("../models/post");
const Membership = require("../models/membership");
const Subscription = require("../models/subscription");
const Genre = require("../models/genre");

const s3UploadBanner = require("../middlewares/s3UploadBanner");
const s3UploadProfile = require("../middlewares/s3UploadProfile");

// Display page on GET
exports.page_get = async (req, res, next) => {
  const pageId = req.params.id;

  // I know. Doesn't look great. If there is no user, then
  // its not their page; if there is a user, checks if
  // the user is the owner and returns that answer
  const isOwnPage = !req.user
    ? false
    : !req.user.creator.page
    ? false
    : String(req.user.creator.page._id) === pageId;

  try {
    const page = await Page.findById(pageId).populate("genre").exec();
    // Set limit
    const pagination_limit = 10;

    // If no page is found
    if (!page) {
      const err = new Error("Page not found");
      err.status = 404;
      return next(err);
    }

    const postsPromise = Post.find({ pageId: pageId })
      .sort({ timestamp: "desc" })
      .limit(pagination_limit)
      .exec();

    const postsCountPromise = Post.countDocuments({ user: req.user });

    const tiersPromise = Membership.find({ page: pageId });

    const [posts, posts_count, tiers] = await Promise.all([
      postsPromise,
      postsCountPromise,
      tiersPromise
    ]);

    const total_pages = Math.ceil(posts_count / pagination_limit);

    let curPageSub;

    if (req.user) {
      const userSubs = await Subscription.find({ user: req.user._id })
        .populate("membership")
        .exec();

      // Find all subs to page (active and not)
      const curPageAllSubs = userSubs.filter(
        (sub) => String(sub.page) === String(pageId)
      );

      // Filter for active
      const active = curPageAllSubs.filter((sub) => {
        return sub.status === "active";
      });

      // If more than one active subscription, that's bad
      if (active.length > 1) {
        const err = new Error(
          "More than one active page sub detected. Please contact administrator."
        );
        err.status = 409;
        return next(err);
      }

      curPageSub = active.length === 0 ? null : active[0];
    } else {
      curPageSub = null;
    }

    // If page is marked inactive
    if (!page.active && !curPageSub && !isOwnPage) {
      const err = new Error("Page is not currently active");
      err.status = 403;
      return next(err);
    }

    // Successful, so render
    return res.render("pages/page-view", {
      title: page.title,
      page,
      tiers,
      posts,
      curPageSub,
      limit: pagination_limit,
      total_pages,
      page_id: page._id
    });
  } catch (err) {
    return next(err);
  }
};

// Handle create page on POST
exports.create_page_post = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    // Successful, make new page
    const page = new Page({
      user: user,
      title: user.creator.name,
      genre: user.creator.genre,
      region: user.region
    });

    await page.save();

    // Save page and remove name/genre fields
    user.creator.page = page;
    user.creator.name = undefined;
    user.creator.genre = undefined;
    await user.save();

    return res.redirect(page.url);
  } catch (err) {
    return next(err);
  }
};

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  try {
    const pageId = req.user.creator.page._id;
    const genresPromise = Genre.find({}, "type").exec();
    const pagePromise = Page.findById(pageId).populate("genre").exec();

    const [genres, page] = await Promise.all([genresPromise, pagePromise]);

    // Page not found
    if (!page) {
      const err = new Error("Page does not exist");
      err.status = 404;
      return next(err);
    }

    // Successful, so render
    return res.render("forms/page-edit", {
      title: "Edit Page",
      page: page,
      genres
    });
  } catch (err) {
    return next(err);
  }
};

// Handle edit page on POST
exports.edit_page_post = [
  // Validate and sanitize fields
  body("pageTitle", "Page title required").trim().isLength({ min: 1 }),
  body("genre1", "At least one genre is required").trim().isLength({ min: 1 }),
  body("desc", "Description cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("facebookHandle").trim().escape(),
  body("instaHandle").trim().escape(),
  body("twitterHandle").trim().escape(),

  async (req, res, next) => {
    const pageId = req.user.creator.page._id;

    const errors = validationResult(req);

    try {
      // If errors exist, rerender form
      if (!errors.isEmpty()) {
        const genresPromise = Genre.find({}, "type").exec();
        const pagePromise = Page.findById(pageId);

        const [genres, page] = await Promise.all([genresPromise, pagePromise]);

        res.render("forms/page-edit", {
          title: "Edit Page",
          page,
          genres,
          errors: errors.array()
        });
        return;
      }
    } catch (err) {
      return next(err);
    }

    try {
      const page = await Page.findById(pageId);

      if (!page) {
        const err = new Error("Page does not exist");
        err.status = 404;
        return next(err);
      }

      const genres = [req.body.genre1];
      if (req.body.genre2) genres.push(req.body.genre2);
      if (req.body.genre3) genres.push(req.body.genre3);

      page.title = req.body.pageTitle;
      page.genre = genres;
      page.description = req.body.desc;
      page.socialUrls = {
        facebookHandle: req.body.facebookHandle,
        instagramHandle: req.body.instaHandle,
        twitterHandle: req.body.twitterHandle
      };

      await page.save();

      return res.redirect(page.url);
    } catch (err) {
      return next(err);
    }
  }
];

exports.set_banner_img_post = async (req, res, next) => {
  const pageId = String(req.user.creator.page._id);

  try {
    const result = await s3UploadBanner(req.file, pageId);

    const page = await Page.findByIdAndUpdate(pageId, {
      bannerImg: result.Location
    });

    return res.redirect(page.url);
  } catch (err) {
    return next(err);
  }
};

exports.set_profile_img_post = async (req, res, next) => {
  const pageId = String(req.user.creator.page._id);

  try {
    const result = await s3UploadProfile(req.file, pageId);

    if (result.errorMsg) {
      const err = new Error(result.errorMsg);
      err.status = 404;
      return next(err);
    }

    const page = await Page.findByIdAndUpdate(pageId, {
      profileImg: result.Location
    });

    return res.redirect(page.url);
  } catch (err) {
    return next(err);
  }
};

// Handle page activate/deactivate on GET
exports.page_activate_get = async (req, res, next) => {
  const pageId = req.user.creator.page._id;

  try {
    const page = await Page.findById(pageId);
    const isActive = page.active;

    const title = isActive ? "Deactivate Page?" : "Activate Page?";

    return res.render("confirms/active", {
      title: title,
      page: page
    });
  } catch (err) {
    return next(err);
  }
};

// Handle page activate/deactivate on POST
exports.page_activate_post = async (req, res, next) => {
  const pageId = req.user.creator.page._id;

  try {
    const page = await Page.findById(pageId);

    page.active = !page.active;
    await page.save();
    return res.redirect("/home");
  } catch (err) {
    return next(err);
  }
};
