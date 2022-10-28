"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Creator = require("../models/creator");
const Genre = require("../models/genre");
const Page = require("../models/page");
const Membership = require("../models/membership");

// Display memberships page on GET
exports.display_memberships_get = (req, res, next) => {
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

      // User artist id does not match page's artist id
      if (req.user.creator._id.toString() !== page.creatorId) {
        return res.redirect(`/${req.params.id}`);
      }

      const memberships = page.tiers;

      res.render(`/${page.url}/memberships`, {
        title: "Memberships",
        memberships: memberships
      });
    });
};

// Add membership on POST
exports.add_membership_post = [
  // Validate and sanitize fields
  body("title", "Tier title required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price is required").trim().isDecimal({ min: 0.01 }),
  body("desc", "Decription is required").trim().isLength({ min: 1 }).escape(),
  body("rewards", "Rewards must be specified").trim().isLength({ min: 1 }),

  (req, res, next) => {}
];
