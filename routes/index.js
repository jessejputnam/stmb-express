"use strict";

const express = require("express");
const router = express.Router();

const authCheckFalse = require("../middlewares/authCheckFalse");
const authCheck = require("../middlewares/authCheck");
const isVerifiedCheck = require("../middlewares/isVerifiedCheck");

const auth_controller = require("../controllers/authController");
const creator_controller = require("../controllers/creatorController");
const page_controller = require("../controllers/pageController");
const memberships_controller = require("../controllers/membershipController");
const post_controller = require("../controllers/postController");
const stripe_controller = require("../controllers/stripeController");

const countryNames = require("../utils/countryNames");

// #####################################################
// #####################################################

// GET request for user home
router.get("/home", authCheckFalse, function (req, res, next) {
  res.render("user-home", { title: "Home", country_names: countryNames });
});

router.get("/not-verified", (req, res, next) => {
  res.render("success-message", {
    message: "Please check email and verify."
  });
});

/* -------------------- Landing Page ------------------ */
// GET request for landing page.
router.get("/", authCheck, auth_controller.index_get);

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

/* -------------------- Become Creator ------------------ */
router.get(
  "/settings",
  authCheckFalse,
  isVerifiedCheck,
  auth_controller.display_settings_get
);

/* -------------------- Become Creator ------------------ */
// GET request for become creator
router.get(
  "/creator-signup",
  authCheckFalse,
  isVerifiedCheck,
  creator_controller.become_creator_get
);

// POST request for become creator
router.post(
  "/creator-signup",
  authCheckFalse,
  isVerifiedCheck,
  creator_controller.become_creator_post
);

// GET request for Stripe creator onboarding
router.get(
  "/onboard-user",
  authCheckFalse,
  isVerifiedCheck,
  stripe_controller.stripe_onboard_get
);

// GET request for refresh_url from accountLink
router.get("/onboard-user/refresh", stripe_controller.stripe_onboard_refresh);

router.get("/onboard-user/success", (req, res, next) => {
  res.render("success-onboarding");
});

/* -------------------- Page Views ------------------ */
// POST request for create page
router.post(
  "/create-page",
  authCheckFalse,
  isVerifiedCheck,
  page_controller.create_page_post
);

// GET request for view page
router.get("/:id", page_controller.page_get);

// GET request for edit page
router.get(
  "/:id/edit",
  authCheckFalse,
  isVerifiedCheck,
  page_controller.edit_page_get
);

// POST request for edit page
router.post(
  "/:id/edit",
  authCheckFalse,
  isVerifiedCheck,
  page_controller.edit_page_post
);

/* ----------------- Membership Page --------------- */
// GET quest for view memberships page
router.get(
  "/:id/memberships",
  authCheckFalse,
  isVerifiedCheck,
  memberships_controller.display_memberships_get
);

// GET quest for add memberships page
router.get(
  "/:id/add-membership",
  authCheckFalse,
  isVerifiedCheck,
  memberships_controller.add_membership_get
);

// POST request for add membership
router.post(
  "/:id/add-membership",
  authCheckFalse,
  isVerifiedCheck,
  memberships_controller.add_membership_post
);

/* ----------------- Posts Page --------------- */
// GET request for display all creator's posts
router.get(
  "/:id/posts",
  authCheckFalse,
  isVerifiedCheck,
  post_controller.posts_display_get
);

// GET request for add post
router.get(
  "/:id/add-post",
  authCheckFalse,
  isVerifiedCheck,
  post_controller.add_post_get
);

// POST request for add post
router.post(
  "/:id/add-post",
  authCheckFalse,
  isVerifiedCheck,
  post_controller.add_post_post
);

module.exports = router;
