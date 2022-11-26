"use strict";

const { body, validationResult } = require("express-validator");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

const User = require("../models/user");
const Page = require("../models/page");
const Membership = require("../models/membership");

const getCurrencyCode = require("../utils/getCurrencyCode");

// #######################################################
// #######################################################

// Display memberships page on GET
exports.display_memberships_get = async (req, res, next) => {
  const userPageId = req.user.creator.page._id;

  // User artist id does not match page's artist id
  if (String(userPageId) !== req.params.id) {
    return res.redirect(`/${req.params.id}`);
  }

  try {
    const page = await Page.findById(userPageId);

    if (!page) {
      const err = new Error("Page does not exist");
      err.status = 404;
      return next(err);
    }

    const memberships = await Membership.find({ page: page });

    return res.render("memberships-view", {
      title: "Memberships",
      memberships
    });
  } catch (err) {
    return next(err);
  }
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
    const errors = validationResult(req);

    const userPageId = req.user.creator.page.toString();

    // User artist id does not match page's artist id
    if (userPageId !== req.params.id) {
      return res.redirect(`/${req.params.id}`);
    }

    if (!errors.isEmpty) {
      return res.render("form-membership-add", {
        title: "Add Membership",
        errors: errors.array()
      });
    }

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

      // Check current number of page memberships
      const tiers = await Membership.find({ page: page });

      if (tiers.length > 3) {
        const err = new Error("Tier list exceeds 4 memberships");
        err.status = 405;
        return next(err);
      }

      // Make app obj
      const membership = new Membership({
        stripePriceId: null,
        stripeProductId: null,
        page: page._id,
        price: req.body.price,
        title: req.body.title,
        imgUrl: req.body.imgUrl || null,
        description: req.body.desc,
        rewards: req.body.rewards.split("||").map((reward) => reward.trim())
      });

      // Make Stripe obj
      const product = await Stripe.products.create(
        {
          name: req.body.title,
          metadata: {
            membershipId: membership._id
          }
        },
        { stripeAccount: user.creator.stripeId }
      );

      const price = await Stripe.prices.create(
        {
          product: product.id,
          unit_amount: req.body.price * 100,
          currency: getCurrencyCode[user.region],
          recurring: {
            interval: "month"
          }
        },
        { stripeAccount: user.creator.stripeId }
      );

      membership.stripeProductId = product.id;
      membership.stripePriceId = price.id;

      await membership.save();

      return res.redirect(`/account/${page._id}/memberships`);
    } catch (err) {
      return next(err);
    }
  }
];

exports.delete_membership_get = async (req, res, next) => {
  const membership = await Membership.findById(req.params.memberid);

  return res.render("membership-delete", {
    title: "Delete Membership",
    membership: membership
  });
};

exports.delete_membership_post = async (req, res, next) => {
  const membershipId = req.body.membershipId;
  const accountId = req.user.creator.stripeId;
  const productId = req.body.productId;
  const priceId = req.body.priceId;

  try {
    // Archive product and price on stripe
    await Stripe.products.update(
      productId,
      { active: false },
      { stripeAccount: accountId }
    );
    await Stripe.prices.update(
      priceId,
      { active: false },
      { stripeAccount: accountId }
    );

    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
