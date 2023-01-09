"use strict";

const express = require("express");
const router = express.Router();

const authCheck = require("../middlewares/authCheck");

const auth_controller = require("../controllers/authController");
const page_controller = require("../controllers/pageController");
const stripe_controller = require("../controllers/stripeController");

// #####################################################
// #####################################################

/* -------------------- Landing Page ------------------ */

// GET request for landing page.
router.get("/", authCheck, auth_controller.index_get);

/* ----------------- About Page --------------- */

// GET request for view page
router.get("/about", (req, res, next) => {
  return res.render("pages/about", {
    title: "About STMB"
  });
});

/* -------------------- Authentication ---------------- */

// GET request for register
router.get("/register", authCheck, auth_controller.signup_get);

// POST request for register
router.post("/register", auth_controller.sign_up_post);

// GET request for login
router.get("/login", authCheck, auth_controller.login_get);

// POST request for login
router.post("/login", auth_controller.login_post);

// GET request for logout
router.get("/logout", auth_controller.logout_get);

/* --------------- Verification Routes --------------- */

// GET request for verifying user from email link
router.get("/verify/:token", auth_controller.verify_email_get);

// POST request for resending verification token
router.post("/verify/resend", auth_controller.resend_token_post);

// POST request to email token resetting password
router.post("/recover", auth_controller.send_reset_email_post);

// POST request for validating token and seeing reset view
router.get("/reset/:token", auth_controller.reset_password_get);

// POST request for resetting password
router.post("/reset/:token", auth_controller.reset_password_post);

/* ------------------ Confirmation Routes ----------------- */
router.get("/subscribe/cancel", (req, res, next) => {
  res.render("success", { message: "Subscription attempt canceled" });
});

// GET request for successful onboarding -> direct to Stripe
router.get("/onboard-user/success", (req, res, next) => {
  res.render("success-onboarding");
});

// GET request for subscription cancelled successfully
router.get(
  "/:id/subscription-canceled",
  stripe_controller.subscription_cancelled_get
);

/* ----------------- Page View --------------- */

// GET request for view page
router.get("/:id", page_controller.page_get);

module.exports = router;
