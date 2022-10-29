"use strict";

const passport = require("passport");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

// Display correct page on index GET
exports.index_get = (req, res, next) => {
  res.render("index", { title: "Smash the Motherboard" });
};

// Display sign up on GET
exports.signup_get = (req, res, next) => {
  res.render("form-sign-up", { title: "STMB Register" });
};

// Handle sign up on POST
exports.sign_up_post = [
  // Validate and sanitize fields
  body("username", "Must be a valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail()
    .escape(),
  body("firstName", "First name is required").trim().isLength({ min: 1 }),
  body("lastName", "Last name is required").trim().isLength({ min: 1 }),
  body("region", "Region must be specified").trim().isLength({ min: 1 }),
  body(
    "password",
    "Password must be at least 8 characters, and contain at least one of each: lowercase, uppercase, symbol, and number"
  )
    .trim()
    .isStrongPassword(),
  body("passConfirm", "Password confirmation must match password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),

  // Process request after validation/sanitization
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("form-sign-up", {
        title: "STMB Register",
        errors: errors.array()
      });
    }

    try {
      // Check if user exists
      const found_user = await User.find({ username: req.body.username });
      if (found_user.length > 0) {
        return res.render("form-sign-up", {
          title: "STMB Register",
          error: "Email is already in use"
        });
      }

      // Continue registration
      const user = new User({
        creator: null,
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        region: req.body.region
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }

        // Successful, redirect to login
        res.redirect("/login");
      });
    } catch (err) {
      return next(err);
    }
  }
];

// Handle login on GET
exports.login_get = (req, res, next) => {
  res.render("form-log-in", {
    title: "STMB Log In",
    errors: req.flash("error")
  });
};

// Handle login on POST
exports.login_post = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
});

// Handle logout on POST
exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
