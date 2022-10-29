"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Genre = require("../models/genre");
const Page = require("../models/page");
const Membership = require("../models/membership");

// Display memberships page on GET
exports.display_memberships_get = (req, res, next) => {
  // User artist id does not match page's artist id
  if (req.user.pageId._id.toString() !== req.params.id) {
    return res.redirect(`/${req.params.id}`);
  }

  Page.findById(req.user.pageId)
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

      const memberships = page.tiers;

      res.render("memberships-view", {
        title: "Memberships",
        memberships: memberships
      });
    });
};

exports.add_membership_get = (req, res, next) => {
  // User artist id does not match page's artist id
  if (req.user.pageId._id.toString() !== req.params.id) {
    return res.redirect(`/${req.params.id}`);
  }

  res.render("form-add-membership", {
    title: "Add Membership"
  });
};

// Add membership on POST
exports.add_membership_post = [
  // Validate and sanitize fields
  body("title", "Tier title required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price is required").trim().isDecimal({ min: 0.01 }),
  body("desc", "Decription is required").trim().isLength({ min: 1 }).escape(),
  body("rewards", "Rewards must be specified").trim().isLength({ min: 1 }),

  (req, res, next) => {
    // User artist id does not match page's artist id
    if (req.user.pageId._id.toString() !== req.params.id) {
      return res.redirect(`/${req.params.id}`);
    }

    User.findById(req.user._id)
      .populate("page")
      .populate("creator")
      .exec((err, result) => {
        if (err) return next(err);
        if (!result) {
          const err = new Error("User not found");
          err.status = 404;
          return next(err);
        }

        const user = result;
        const creator = user.creator;
        const page = user.page;

        const membership = new Membership({
          creator: creator,
          page: page,
          price: req.body.price,
          title: req.body.title,
          imgUrl: req.body.imgUrl || null,
          description: req.body.desc
        });

        membership.save((err) => {
          if (err) return next(err);
        });
      });
  }
];
