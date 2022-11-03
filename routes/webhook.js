"use strict";

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const authCheckFalse = require("../middlewares/authCheckFalse");
const authCheck = require("../middlewares/authCheck");
const isVerifiedCheck = require("../middlewares/isVerifiedCheck");

const User = require("../models/user");

const webhook_controller = require("../controllers/webhookController");

const Stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);

// #####################################################
// #####################################################

// Account webhooks

// Connect webhooks
// Stripe CLI webhook secret for testing endpoint locally.
const endpointSecret =
  "whsec_e2070f0395fb379a063a351bf8d45d4f86969e7b51c69237b8f1b8763e72f789";

router.post("/connect", (req, res, next) => {
  // console.log("REQUEST HEADERS", req.headers);
  const sig = req.headers["stripe-signature"];
  // console.log("webbook.js:SIG", sig);

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
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
