"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

// Handle onboarding creator on POST
exports.stripe_onboard_post = async (req, res, next) => {
  try {
    const account = await stripe.accounts.create({
      type: "standard",
      email: req.user.username,
      country: req.user.region,
      business_profile: {
        name: req.user.creator.name
      }
    });

    req.session.accountID = account.id;

    const accountLink = await stripe.accountLinks.create({
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
exports.stripe_onboarding_refresh = async (req, res, next) => {
  if (!req.session.accountID) {
    return res.redirect("/home");
  }

  try {
    const { accountID } = req.session;
    const origin = `${req.secure ? "https://" : "http://"}${req.headers.host}`;

    const accountLink = await stripe.accountLinks.create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/home`
    });

    res.redirect(303, accountLink.url);
  } catch (err) {
    return next(err);
  }
};
