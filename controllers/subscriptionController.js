"use strict";

const Page = require("../models/page");
const Subscription = require("../models/subscription");

// ####################################################
// ####################################################

exports.subscription_success_get = async (req, res, next) => {
  try {
    const membershipId = req.params.id;

    const page = await Page.findOne({ tiers: membershipId });
    if (!page) {
      const err = new Error("Page not found");
      err.status = 404;
      return next(err);
    }

    // Create new subscription object with active=false
    // Wait for webhook listen for active status
    const subscription = new Subscription({
      user: req.user._id,
      page: page,
      membership: membershipId,
      active: false
    });

    return res.render("success-message", {
      title: "Subscription pending",
      message: `Request to subscribe to ${page.title} recieved. Check your subscriptions for active status`
    });
  } catch (err) {
    return next(err);
  }
};
