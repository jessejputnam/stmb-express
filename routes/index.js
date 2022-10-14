"use strict";

const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");
const artist_controller = require("../controllers/artistController");

// Middleware to check for user
const authCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/home");
  } else {
    next();
  }
};

// Middleware to check for no user
const authCheckFalse = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

// GET request for user home
router.get("/home", authCheckFalse, function (req, res, next) {
  res.render("home", { title: "Home" });
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

/* -------------------- Become Creator ------------------ */
// GET request for become creator
router.get(
  "/creator-signup",
  authCheckFalse,
  artist_controller.become_creator_get
);

// POST request for become creator
router.post(
  "/creator-signup",
  authCheckFalse,
  artist_controller.become_creator_post
);

module.exports = router;
