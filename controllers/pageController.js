"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Page = require("../models/page");
const Post = require("../models/post");

// Display page on GET
exports.page_get = (req, res, next) => {
  async.parallel(
    {
      page(callback) {
        Page.findById(req.params.id)
          .populate("genre")
          .populate("tiers")
          .exec(callback);
      },
      posts(callback) {
        Post.find({ pageId: req.params.id })
          .sort({ timestamp: "desc" })
          .exec(callback);
      }
    },
    (err, results) => {
      if (err) return next(err);

      if (!results.page) {
        const err = new Error("Page not found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render("page-view", {
        title: results.page.title,
        page: results.page,
        posts: results.posts
      });
    }
  );
};

// Handle create page on POST
exports.create_page_post = (req, res, next) => {
  User.findById(req.user._id, (err, result) => {
    if (err) return next(err);

    if (!result) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const user = result;

    // Successful, make new page
    const page = new Page({
      user: user,
      title: user.creator.name,
      genre: user.creator.genre,
      region: user.region
    });

    page.save((err) => {
      if (err) return next(err);

      user.creator.page = page;
      user.save((err) => {
        if (err) return next(err);

        return res.redirect(page.url);
      });
    });
  });
};

// Display edit page on GET
exports.edit_page_get = (req, res, next) => {
  Page.findById(req.params.id)
    .populate("genre")
    .populate("tiers")
    .exec((err, result) => {
      if (err) return next(err);

      const page = result;

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
      res.render("form-page-edit", {
        title: "Edit Page",
        page: page
      });
    });
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

  (req, res, next) => {
    if (String(req.user.creator.page._id) !== req.params.id) {
      return res.redirect("/home");
    }

    Page.findById(req.params.id, (err, result) => {
      if (err) return next(err);
      const page = result;

      // Page not found
      if (!page) {
        const err = new Error("Page does not exist");
        err.status = 404;
        return next(err);
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

      page.description = req.body.desc;
      page.socialUrls = {
        facebookHandle: req.body.facebookHandle,
        instagramHandle: req.body.instaHandle,
        twitterHandle: req.body.twitterHandle
      };

      page.save((err) => {
        if (err) return next(err);

        return res.redirect(page.url);
      });
    });
  }
];
