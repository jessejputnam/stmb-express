"use strict";

const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Page = require("../models/page");
const Post = require("../models/post");
const Membership = require("../models/membership");
const Subscription = require("../models/subscription");

const s3UploadBanner = require("../middlewares/s3UploadBanner");

// Display page on GET
exports.page_get = async (req, res, next) => {
  const pageId = req.params.id;

  // I know. Doesn't look great. Checks if no user, then
  // its false; if there is a user, checks if the user
  // is the owner and returns that answer
  const isOwnPage = !req.user
    ? false
    : req.user.creator
    ? String(req.user.creator.page) === pageId
    : false;

  try {
    const page = await Page.findById(pageId).populate("genre").exec();

    // If no page is found
    if (!page) {
      const err = new Error("Page not found");
      err.status = 404;
      return next(err);
    }

    const postsPromise = Post.find({ pageId: pageId })
      .sort({ timestamp: "desc" })
      .exec();

    const tiersPromise = Membership.find({ page: pageId });

    const [posts, tiers] = await Promise.all([postsPromise, tiersPromise]);

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
    return res.render("page-view", {
      title: page.title,
      page,
      tiers,
      posts,
      curPageSub
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

    user.creator.page = page;
    await user.save();

    return res.redirect(page.url);
  } catch (err) {
    return next(err);
  }
};

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id).populate("genre").exec();

    // Page not found
    if (!page) {
      const err = new Error("Page does not exist");
      err.status = 404;
      return next(err);
    }

    // User artist id does not match page's artist id
    if (String(req.user._id) !== String(page.user._id)) {
      return res.redirect(`/${req.params.id}`);
    }

    // Successful, so render
    return res.render("form-page-edit", {
      title: "Edit Page",
      page: page
    });
  } catch (err) {
    return next(err);
  }
};

// Handle edit page on POST
exports.edit_page_post = [
  //! Verify with Ed validation and sanitization
  // Validate and sanitize fields
  body("desc", "Description cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("facebookHandle").trim().escape(),
  body("instaHandle").trim().escape(),
  body("twitterHandle").trim().escape(),
  //! Change sanitize and validate for images

  async (req, res, next) => {
    if (String(req.user.creator.page._id) !== req.params.id) {
      return res.redirect("/home");
    }

    const errors = validationResult(req);
    // Errors, rerender form
    if (!errors.isEmpty()) {
      res.render("form-page-edit", {
        title: "Edit Page",
        page: page,
        errors: errors
      });
      return;
    }

    try {
      const page = await Page.findById(req.params.id);

      if (!page) {
        const err = new Error("Page does not exist");
        err.status = 404;
        return next(err);
      }

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
  const pageId = String(req.user.creator.page);
  try {
    const result = await s3UploadBanner(req.file, pageId);
    console.log(result);

    const page = await Page.findByIdAndUpdate(pageId, {
      bannerImg: result.Location
    });

    return res.redirect(page.url);
  } catch (err) {
    return next(err);
  }
};

// Handle page activate/deactivate on GET
exports.page_activate_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    const isActive = page.active;

    const title = isActive ? "Deactivate Page?" : "Activate Page?";

    return res.render("confirm-active", {
      title: title,
      page: page
    });
  } catch (err) {
    return next(err);
  }
};

// Handle page activate/deactivate on POST
exports.page_activate_post = async (req, res, next) => {
  const pageId = req.params.id;

  try {
    const page = await Page.findById(pageId);

    page.active = !page.active;
    await page.save();
    return res.redirect("/home");
  } catch (err) {
    return next(err);
  }
};
