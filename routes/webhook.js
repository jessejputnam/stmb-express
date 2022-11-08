"use strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Subscription = require("../models/subscription");

const Stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// #####################################################
// #####################################################

// --------------------------------- Account webhooks

// --------------------------------- Connect webhooks
router.post("/connect", async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  // Check if webhook signing is configured
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return next(err);
  }

  // Handle the event
  switch (event.type) {
    // CREATOR ACCOUNT UPDATED
    case "account.updated":
      const account = event.data.object;

      // Once onboard is complete, update user obj
      if (!account.metadata.onboardComplete && account.details_submitted) {
        account.metadata.onboardComplete = true;

        User.findOne({ username: account.email }, (err, user) => {
          if (err) return next(err);
          user.creator.onboardComplete = true;

          user.save((err) => {
            if (err) return next(err);
          });
        });
      }

      break;
    // SUBSCRIPTION ACTIVE/UPDATED
    case "customer.subscription.updated":
      const stripeSub = event.data.object;
      // listen for success

      try {
        // creator
        //! -- add to a log on analytics?

        // customer
        // -- Update sub active status in app
        const appSub = await Subscription.findOne({
          stripeSubscriptionId: stripeSub.id
        });

        console.log("APPSUB", appSub);

        if (stripeSub.status === "active") {
          appSub.active = true;
        } else {
          appSub.active = false;
        }
        appSub.temp = null;

        await appSub.save();
      } catch (err) {
        return next(err);
      }

      break;
    case "account.application.deauthorized":
      const application = event.data.object;
      // Then define and call a function to handle the event account.application.deauthorized
      break;
    case "account.external_account.updated":
      const externalAccount = event.data.object;
      // Then define and call a function to handle the event account.external_account.updated
      break;
    case "balance.available":
      const balance = event.data.object;
      // Then define and call a function to handle the event balance.available
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case "payout.failed":
      const payout = event.data.object;
      // Then define and call a function to handle the event payout.failed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("Successful update");
});

module.exports = router;
