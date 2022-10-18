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

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      const err = new Error("Page does not exist");
      err.status = 404;
      return next(err);
    } else {
      // Check if user has permission to edit
      if (req.user.creator._id.toString() !== page.creatorId)
        res.redirect(`/${req.params.id}`);

      // Successful, so render
      res.render("form-page-edit", {
        title: "Edit Page",
        page: page
      });
    }
  } catch (err) {
    return next(err);
  }
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
            res.redirect(page.url);
          });
        });
      });
    }
  );
};

// Handle edit page on PUT
exports.edit_page_put = (req, res, next) => {};
