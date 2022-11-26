"use strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Subscription = require("../models/subscription");
const Membership = require("../models/membership");

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

  // ! UNCOMMENT ON LIVE
  // if (!event.livemode) {
  //   const err = new Error("This is a test event. Please edit codebase to test what you would like.")
  //   err.status = 511;
  //   return next(err);
  // }

  // Handle the event
  switch (event.type) {
    /* --------- CREATOR ACCOUNT ACTIVITY ----------- */

    // ON CREATOR ACCOUNT CHANGES
    case "account.updated":
      const account = event.data.object;

      // ON DETAILS SUBMITTED
      if (account.metadata.onboard_complete === "false") {
        try {
          const creator = await User.findOne({ username: account.email });
          const sub_details = account.details_submitted;

          account.metadata.onboard_complete = sub_details ? "true" : "false";
          creator.creator.stripeOnboardComplete = sub_details;

          await creator.save();
        } catch (err) {
          return next(err);
        }
      }

      // ON CHANGING CARD PAYMENT CAPABILITY
      // - Manual changing of the metadata allows a check for changed status without a mongoDB call
      if (
        account.metadata.payment_status !== account.capabilities.card_payments
      ) {
        try {
          const creator = await User.findOne({ username: account.email });
          const payment_status = account.capabilities.card_payments;

          creator.creator.stripeStatus = payment_status;
          account.metadata.payment_status = payment_status;

          await creator.save();
        } catch (err) {
          return next(err);
        }
      }

      // CHECK STRIPE REQUIREMENTS FULFILLED
      // - deadline appears and metadata does not know
      if (account.requirements.current_deadline) {
        if (account.metadata.stripe_issue === "false") {
          try {
            const creator = await User.findOne({ username: account.email });
            creator.creator.stripeIssue = true;
            account.metadata.stripe_issue = "true";

            await creator.save();
          } catch (err) {
            return next(err);
          }
        }
        // - deadline disappears and metadata does not know
      } else {
        if (account.metadata.stripe_issue === "true") {
          try {
            const creator = await User.findOne({ username: account.email });
            creator.creator.stripeIssue = false;
            account.metadata.stripe_issue = "false";

            await creator.save();
          } catch (err) {
            return next(err);
          }
        }
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
    // When product updates
    case "product.updated":
      const product = event.data.object;
      console.log("-----------PRODUCT.UPDATED-----------");

      // On creator deleting membership
      try {
        if (!product.active) {
          console.log("PRODUCT ARCHIVED");

          // Find the membership attached to product id
          const membership = await Membership.findOne({
            stripeProductId: product.id
          });

          // Find all subscriptions made with membership
          const subscriptions = await Subscription.find({
            membership: membership
          })
            .populate("page")
            .exec();

          await Membership.findByIdAndRemove(membership._id);

          // Loop over subscriptions
          if (subscriptions.length) {
            for (let sub of subscriptions) {
              const creatorId = sub.page.user;
              const stripeSubId = sub.stripeSubscriptionId;

              // Delete Stripe subscription
              const creator = await User.findById(creatorId);

              await Stripe.subscriptions.del(stripeSubId, {
                stripeAccount: creator.creator.stripeId
              });

              // Update subscription object to give customer a warning
              sub.membership = null;
              await sub.save();
            }
          }
        }
      } catch (err) {
        return next(err);
      }

      break;
    // When Price updates
    case "price.updated":
      const price = event.data.object;
      console.log("-----------PRICE.UPDATED-----------");
      break;

    /* ---------- SUBSCRIPTION ACTIVITY ------------- */

    // SUBSCRIPTION ACTIVE/UPDATED
    case "customer.subscription.updated":
      console.log("------CUSTOMER.SUBSCRIPTION.UPDATED-----");

      const stripeSub = event.data.object;
      // listen for success

      try {
        // creator
        //! An alert to the creator?
        //! -- add to a log on analytics?

        // customer
        // -- Update sub active status in app
        const appSub = await Subscription.findOne({
          stripeSubscriptionId: stripeSub.id
        });

        // Change app subscription active status according to stripe status
        appSub.status = stripeSub.status;
        appSub.temp = null;

        await appSub.save();
      } catch (err) {
        return next(err);
      }

      break;
    // On purposeful subscription cancellation
    case "customer.subscription.deleted":
      console.log("-------CUSTOMER.SUBSCRIPTION.DELETED------");

      const canceledSub = event.data.object;
      try {
        const canceledAppSub = await Subscription.findOne({
          stripeSubscriptionId: canceledSub.id
        });

        canceledAppSub.status = canceledSub.status;
        await canceledAppSub.save();
      } catch (err) {
        return next(err);
      }
      break;
    // Each billing interval when a payment succeeds
    case "invoice.paid":
      break;
    // Each billing interval when a payment fails
    case "invoice.payment_failed":
      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("Successful update");
});

module.exports = router;
