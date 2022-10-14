"use strict";

const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");

// Middleware to check if already logged in
const authCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/home");
  } else {
    next();
  }
};

// GET request for landing page.
router.get("/", authCheck, auth_controller.index_get);

// GET request for register
router.get("/register", authCheck, auth_controller.signup_get);

// POST request for register
router.post("/register", auth_controller.sign_up_post);

// GET request for login
router.get("/login", authCheck, auth_controller.login_get);

// POST request for login
router.post("/login", auth_controller.login_post);

module.exports = router;
