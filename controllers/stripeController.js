"use strict";

const User = require("../models/user");
const Subscription = require("../models/subscription");
const Membership = require("../models/membership");
const Page = require("../models/page");

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
        onboard_complete: "false",
        payment_status: "pending",
        stripe_issue: "true"
      }
    });

    await User.findByIdAndUpdate(req.user._id, {
      "creator.stripeId": account.id
    });

    const accountLink = await Stripe.accountLinks.create({
      account: account.id,
      //! change to https for production
      refresh_url: `http://${req.headers.host}/onboard-user/refresh`,
      return_url: `http://${req.headers.host}/onboard-user/success`,
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
exports.create_subscription_post = async (req, res, next) => {
  try {
    const membershipId = req.body.membershipId;

    const membership = await Membership.findById(membershipId)
      .populate("page")
      .exec();

    const creator = await User.findById(membership.page.user);

    const user = req.user;

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

    // Create subscription obj in app for customer
    const subscription = new Subscription({
      user: user._id,
      page: membership.page._id,
      membership: membership._id,
      stripeSubscriptionId: null
    });

    const stripeSubscription = await Stripe.subscriptions.create(
      {
        customer: user.stripeId,
        items: [
          {
            price: membership.stripePriceId
          }
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription"
        },
        application_fee_percent: 8,
        expand: ["latest_invoice.payment_intent"]
      },
      {
        stripeAccount: creator.creator.stripeId
      }
    );

    // Save subscripition
    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.temp =
      stripeSubscription.latest_invoice.payment_intent.client_secret;
    await subscription.save();

    return res.redirect(`/subscribe/confirm/${subscription._id}`);
  } catch (err) {
    return next(err);
  }
};

exports.confirm_subscription_get = async (req, res, next) => {
  const subId = req.params.id;

  try {
    const subscription = await Subscription.findById(subId)
      .populate("page")
      .exec();
    const creator = await User.findById(subscription.page.user);

    res.render("confirm-subscription", {
      title: "Finalize Subscription",
      stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
      client_secret: subscription.temp,
      stripe_sub_id: subscription.stripeSubscriptionId,
      app_sub_id: subId,
      creator_acct: creator.creator.stripeId
    });
    return;
  } catch (err) {
    return next(err);
  }
};

exports.cancel_subscription_post = async (req, res, next) => {
  const creatorId = req.body.creatorId;
  const stripeSubId = req.body.stripeSubId;

  try {
    const creator = await User.findById(creatorId);
    await Stripe.subscriptions.del(stripeSubId, {
      stripeAccount: creator.creator.stripeId
    });

    res.redirect(`/${creator.creator.page}/subscription-canceled`);
  } catch (err) {
    return next(err);
  }
};

exports.subscription_cancelled_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);

    res.render("success-message", {
      title: "Subscription Cancelled",
      message: `You have successfully unsubscribed from ${page.title}`
    });
  } catch (err) {
    return next(err);
  }
};
