"use strict";

const express = require("express");
const router = express.Router();

const isVerifiedCheck = require("../middlewares/isVerifiedCheck");

const auth_controller = require("../controllers/authController");
const creator_controller = require("../controllers/creatorController");

const countryNames = require("../utils/countryNames");
const Subscription = require("../models/subscription");

/* -------------------- HOMEPAGE ------------------ */

// GET request for display user home
router.get("/", auth_controller.user_home_get);

// GET request when user has not email verified yet
router.get("/not-verified", (req, res, next) => {
  res.render("success-message", {
    title: "Check email",
    message: "Please check email and verify."
  });
});

/* -------------------- SETTINGS ------------------ */

// GET request for user settings
router.get("/settings", isVerifiedCheck, auth_controller.display_settings_get);

/* ------------------ BECOME CREATOR ---------------- */

// GET request for become creator
router.get(
  "/creator-signup",
  isVerifiedCheck,
  creator_controller.become_creator_get
);

// POST request for become creator
router.post(
  "/creator-signup",
  isVerifiedCheck,
  creator_controller.become_creator_post
);

module.exports = router;
