"use strict";

const express = require("express");
const router = express.Router();

const stripe_controller = require("../controllers/stripeController");
const subscription_controller = require("../controllers/subscriptionController");

/* -------------------- SUBSCRIPTIONS ------------------ */
// POST request for add subscription
router.post("/add", stripe_controller.create_subscription_post);

// GET request for confirm sub with payment
router.get("/:id/confirm", stripe_controller.confirm_subscription_get);

// GET request for confirm subscription success
router.get("/:id/success", subscription_controller.subscription_success_get);

// POST request for cancel subscription signup
router.post("/confirm/:id/cancel", stripe_controller.cancel_sub_signup_post);

// GET request for cancel subscription
router.get("/:id/cancel", stripe_controller.cancel_subscription_get);

// POST request for cancel subscription
router.post("/:id/cancel", stripe_controller.cancel_subscription_post);

module.exports = router;
