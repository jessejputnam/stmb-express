"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Creator = require("../models/creator");
const Genre = require("../models/genre");
const Page = require("../models/page");

// Display page on GET
exports.page_get = (req, res, next) => {
  //? Will need to change to handle posts / membership tiers
  Page.findById(req.params.id)
    .populate("genre")
    .exec((err, page) => {
      if (err) return next(err);
      if (!page) {
        // No results
        const err = new Error("Page not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("page-view", {
        title: page.title,
        page: page
      });
    });
};

// Handle create page on POST
exports.create_page_post = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findById(req.user._id).exec(callback);
      },
      creator(callback) {
        Creator.findById(req.user.creator._id).populate("genre").exec(callback);
      }
    },
    (err, results) => {
      if (err) return next(err);
      if (!results.user) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      if (!results.creator) {
        const err = new Error("Creator not found");
        err.status = 404;
        return next(err);
      }

      // Successful, make new page
      const page = new Page({
        creatorId: results.creator._id,
        title: results.creator.name,
        genre: results.creator.genre,
        region: results.user.region
      });

      page.save((err) => {
        if (err) return next(err);

        // Update creator obj to point to page
        results.creator.page = page;
        results.creator.save((err) => {
          if (err) return next(err);

          results.user.pageId = page._id;
          results.user.save((err) => {
            if (err) return next(err);
            return res.redirect(page.url);
          });
        });
      });
    }
  );
};

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  Page.findById(req.params.id)
    .populate("genre")
    .populate({
      path: "tiers",
      populate: { path: "top" }
    })
    .populate({
      path: "tiers",
      populate: { path: "middle" }
    })
    .populate({
      path: "tiers",
      populate: { path: "bottom" }
    })
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
      if (req.user.creator._id.toString() !== page.creatorId) {
        return res.redirect(`/${req.params.id}`);
      }

      // Successful, so render
      res.render("form-page-edit", {
        title: "Edit Page",
        page: page
      });
    });

  // try {
  //   const page = await Page.findById(req.params.id);

  //   if (!page) {
  //     const err = new Error("Page does not exist");
  //     err.status = 404;
  //     return next(err);
  //   } else {
  //     // Check if user has permission to edit
  //     if (req.user.creator._id.toString() !== page.creatorId)
  //       res.redirect(`/${req.params.id}`);

  //     // Successful, so render
  //     res.render("form-page-edit", {
  //       title: "Edit Page",
  //       page: page
  //     });
  //   }
  // } catch (err) {
  //   return next(err);
  // }
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
    if (String(req.user.pageId) !== req.params.id) {
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

      console.log(page);
      page.description = req.body.desc;
      page.socialUrls.facebookHandle = req.body.facebookHandle;
      page.socialUrls.instagramHandle = req.body.instaHandle;
      page.socialUrls.twitterHandle = req.body.twitterHandle;
      console.log(page);

      page.save((err) => {
        if (err) return next(err);

        return res.redirect(page.url);
      });
    });
    const errors = validationResult(req);
  }
];
