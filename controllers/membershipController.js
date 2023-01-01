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
  const pageId = req.user.creator.page._id;

  try {
    const page = await Page.findById(pageId);

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
  return res.render("form-membership-add", {
    title: "Add Membership"
  });
};

// Add membership on POST
exports.add_membership_post = [
  // Validate and sanitize fields
  body("title", "Tier title required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price is required").trim().isInt({ min: 1 }),
  body("desc", "Decription is required").trim().isLength({ min: 1 }).escape(),
  body("rewards", "Rewards must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const user = req.user;
    const pageId = user.creator.page._id;

    if (!errors.isEmpty) {
      return res.render("form-membership-add", {
        title: "Add Membership",
        errors: errors.array()
      });
    }

    try {
      const page = await Page.findById(pageId);

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

      return res.redirect("/account/memberships");
    } catch (err) {
      return next(err);
    }
  }
];

exports.delete_membership_get = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id);

    return res.render("confirm-delete-membership", {
      title: "Delete Membership",
      membership: membership
    });
  } catch (err) {
    return next(err);
  }
};

// exports.delete_membership_get = async (req, res, next) => {
//   const id = req.params.id;
//   try {
//     const membership = await Membership.findById(id);

//     return res.render();
//   } catch (err) {
//     return next(err);
//   }
// };

exports.delete_membership_post = async (req, res, next) => {
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
