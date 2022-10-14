"use strict";

const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");

// Middleware to check if user already logged in
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

// GET request for user home
router.get("/", authCheck, function (req, res, next) {
  res.render("home", { title: "Home" });
});

// GET request for logout
router.get("/logout", auth_controller.logout_get);

module.exports = router;
