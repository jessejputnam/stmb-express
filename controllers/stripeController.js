"use strict";

const User = require("../models/user");

const Stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

// ###########################################################
// Creator Accounts
// ###########################################################

// Handle onboarding creator on GET
exports.stripe_onboard_get = async (req, res, next) => {
  try {
    const account = await Stripe.accounts.create({
      type: "standard",
      email: req.user.username,
      country: req.user.region,
      business_profile: {
        name: req.user.creator.name
      },
      metadata: {
        onboardComplete: false
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
      "creator.stripeId": account.id
    });

    const accountLink = await Stripe.accountLinks.create({
      account: account.id,
      //! change to https for production
      refresh_url: `http://${req.headers.host}/onboard-user/refresh`,
      return_url: `http://${req.headers.host}/home`,
      type: "account_onboarding"
    });

    return res.redirect(303, accountLink.url);
  } catch (err) {
    return next(err);
  }
};

// Handle onboaring refresh on GET
exports.stripe_onboard_refresh = async (req, res, next) => {
  if (!req.user.creator.stripeId) {
    const err = new Error("No account ID found for Stripe onboarding.");
    err.status = 404;
    return next(err);
  }

  try {
    const accountID = req.user.creator.stripeId;
    //! change to https ONLY for production
    const origin = `${req.secure ? "https://" : "http://"}${req.headers.host}`;

    const accountLink = await Stripe.accountLinks.create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/onboard-user/success`
    });

    return res.redirect(303, accountLink.url);
  } catch (err) {
    return next(err);
  }
};

// ########################################################
// User Accounts
// ########################################################

// Handle add subscription on POST
exports.add_subscription_post = async (req, res, next) => {
  try {
    // const priceId = req.body.priceId;
    const membership = req.body.membership;
    const creatorId = req.body.creatorId;

    const user = await User.findById(req.user._id);
    const creator = await User.findById(creatorId);

    // If current user does not already have stripe acct,
    // create a new stripe customer obj
    if (!user.stripeId) {
      const customer = await Stripe.customers.create(
        {
          email: user.username,
          name: `${user.firstname} ${user.lastname}`,
          metadata: {
            appId: user._id
          }
        },
        { stripeAccount: creator.creator.stripeId }
      );

      user.stripeId = customer.id;
      await user.save();
    }

    const session = await Stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: user.stripeId,
        line_items: [
          {
            price: membership.stripePriceId,
            quantity: 1
          }
        ],

        //! change to https for production
        success_url: `http://${req.headers.host}/subscription/success/${membership._id}`,
        cancel_url: `http://${req.headers.host}/subscription/cancel`
      },
      { stripeAccount: creator.creator.stripeId }
    );
  } catch (err) {
    return next(err);
  }
};
