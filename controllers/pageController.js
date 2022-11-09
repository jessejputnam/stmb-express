"use strict";

const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Page = require("../models/page");
const Post = require("../models/post");
const Membership = require("../models/membership");
const Subscription = require("../models/subscription");

// Display page on GET
exports.page_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id).populate("genre").exec();

    if (!page) {
      const err = new Error("Page not found");
      err.status = 404;
      return next(err);
    }

    const posts = await Post.find({ pageId: req.params.id })
      .sort({ timestamp: "desc" })
      .exec();

    const tiers = await Membership.find({ page: page._id });

    const userSubs = await Subscription.find({ user: req.user._id })
      .populate("membership")
      .exec();
    const curPageSub = userSubs.filter(
      (sub) => String(sub.page) === String(page._id)
    )[0];
    console.log(curPageSub);

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

    if (!result) {
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
    const page = await Page.findById(req.params.id)
      .populate("genre")
      .populate("tiers")
      .exec();

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
