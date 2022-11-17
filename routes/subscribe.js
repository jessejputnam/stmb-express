"use strict";

const express = require("express");
const router = express.Router();

const stripe_controller = require("../controllers/stripeController");

/* -------------------- SUBSCRIPTIONS ------------------ */

router.post("/add-subscription", stripe_controller.create_subscription_post);

router.get("/confirm/:id", stripe_controller.confirm_subscription_get);

// POST request for cancel subscription
router.post("/cancel-subscription", stripe_controller.cancel_subscription_post);

module.exports = router;
