"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Page = require("../models/page");
const Membership = require("../models/membership");

// Display memberships page on GET
exports.display_memberships_get = (req, res, next) => {
  const userPageId = req.user.creator.page.toString();

  // User artist id does not match page's artist id
  if (userPageId !== req.params.id) {
    return res.redirect(`/${req.params.id}`);
  }

  Page.findById(req.user.creator.page)
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
  const userPageId = req.user.creator.page.toString();

  // User artist id does not match page's artist id
  if (userPageId !== req.params.id) {
    return res.redirect(`/${req.params.id}`);
  }

  res.render("form-membership-add", {
    title: "Add Membership"
  });
};

// Add membership on POST
exports.add_membership_post = [
  // Validate and sanitize fields
  body("title", "Tier title required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price is required").trim().isDecimal({ min: 0.01 }),
  body("desc", "Decription is required").trim().isLength({ min: 1 }).escape(),
  body("rewards", "Rewards must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    const userPageId = req.user.creator.page.toString();

    // User artist id does not match page's artist id
    if (userPageId !== req.params.id) {
      return res.redirect(`/${req.params.id}`);
    }

    console.log("MEMBSHIP CHECK 1");

    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: "creator",
          populate: {
            path: "page",
            model: "Page"
          }
        })
        .exec();

      if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      const page = user.creator.page;

      if (page.tiers.length > 2) {
        const err = new Error("Tier list exceeds 3 memberships");
        err.status = 405;
        return next(err);
      }

      const membership = new Membership({
        creator: user,
        price: req.body.price,
        title: req.body.title,
        imgUrl: req.body.imgUrl || null,
        description: req.body.desc,
        rewards: req.body.rewards.split("||").map((reward) => reward.trim())
      });

      await membership.save();

      page.tiers.push(membership._id);

      await page.save();

      return res.redirect(`/${page._id}/memberships`);
    } catch (err) {
      return next(err);
    }
  }
];
