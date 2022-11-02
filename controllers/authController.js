"use strict";

const passport = require("passport");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Token = require("../models/token");

const sendEmail = require("../utils/sendEmail");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const countryCodes = require("../utils/countryCodes");

// ######################################################
// ######################################################

// Display correct page on index GET
exports.index_get = async (req, res, next) => {
  const stripe = require("stripe")(
    "sk_test_51LTPNTGgdtm8Y5856tABXqKjUyCeeGeIJ7qimz4ZfUxOWFMT4oi9YZOwt3ANd80pEZjVxQmwbtmqhzn4MtytARpY00OfTrReQY"
  );

  await stripe.accounts.del("acct_1LziPu2fFTB8Bjsi");
  return res.render("index", { title: "Smash the Motherboard" });
};

// ################# REGISTERING ##################

// Display sign up on GET
exports.signup_get = (req, res, next) => {
  return res.render("form-sign-up", {
    title: "STMB Register",
    country_list: countryCodes
  });
};

// Handle sign up on POST
exports.sign_up_post = [
  // Validate and sanitize fields
  body("username", "Must be a valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
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
      return res.render("form-sign-up", {
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
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        region: req.body.region
      });

      user.save(async (err, theuser) => {
        if (err) {
          return next(err);
        }

        await sendVerificationEmail(theuser, req, next);

        // Successful, redirect to verification reminder
        return res.render("success-message", {
          message:
            "A verification email has been sent to " +
            user.username +
            ". Please follow link to sign in."
        });
      });
    } catch (err) {
      return next(err);
    }
  }
];

// ################ LOGGING IN ##################

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

    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
};

// ########### EMAIL VERIFICATION ############

// Handle verify email on GET
exports.verify_email_get = async (req, res, next) => {
  if (!req.params.token) {
    const err = new Error("Unable to find a user for this token");
    err.status = 404;
    return next(err);
  }

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      const err = new Error(
        "Unable to find a valid token. Your token may have expired"
      );
      err.status = 404;
      return next(err);
    }

    // Token found; look for matching user
    User.findOne({ _id: token.userId }, (err, user) => {
      if (err) return next(err);

      if (!user) {
        const err = new Error("Unable to find a user for this token");
        err.status = 404;
        return next(err);
      }

      if (user.isVerified) {
        const err = new Error("This user is already verified");
        err.status = 400;
        return next(err);
      }

      // Verify and save user
      user.isVerified = true;
      user.save((err) => {
        if (err) return next(err);

        return res.redirect("/login");
      });
    });
  } catch (err) {
    if (err) return next(err);
  }
};

// Handle resend token on POST
exports.resend_token_post = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ username: email });

    if (!user) {
      const err = new Error(
        `The email address ${email} is not associated with any account`
      );
      err.status = 404;
      return next(err);
    }

    if (user.isVerified) {
      const err = new Error("This user is already verified");
      err.status = 400;
      return next(err);
    }

    await sendVerificationEmail(user, req, res);
    return res.redirect("/home");
  } catch (err) {
    if (err) return next(err);
  }
};

// ########### PASSWORD RESET/RECOVER ############

// Handle send password reset email on POST
exports.send_reset_email_post = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ username: email });

    if (!user) {
      const err = `The email address ${email} is not associated with any account`;
      err.status = 404;
      return next(err);
    }

    // Generate and set password reset token
    user.generatePasswordReset();

    // Save the updated user object
    await user.save();

    // Send email
    const subject = "Password change request";
    const to = user.username;
    const from = process.env.FROM_EMAIL;
    //! Change to secure for production
    const link = `http://${req.headers.host}/reset/${user.resetPasswordToken}`;
    // const link = `https://${req.headers.host}/reset-password/${user.resetPasswordToken}`;
    const html = `
      <p>Hi ${user.firstname}</p>
      <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `;

    await sendEmail({ to, from, subject, html });
    return res.redirect("/home");
  } catch (err) {
    if (err) return next(err);
  }
};

// Handle validate reset token and display reset view on POST
exports.reset_password_get = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      const err = "Password reset token is invalid or has exprired.";
      err.status = 401;
      return next(err);
    }

    return res.render("form-password-reset", {
      user: user
    });
  } catch (err) {
    if (err) return next(err);
  }
};

// Handle reset password on POST
exports.reset_password_post = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      const err = "Password reset token is invalid or has exprired.";
      err.status = 401;
      return next(err);
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true;

    await user.save();

    const subject = "Your password has been changed";
    const to = user.username;
    const from = process.env.FROM_EMAIL;
    const html = `
      <p>Hi ${user.firstname}</p>
      <p>This is a confirmation that the password for your account ${user.username} has just been changed.</p>
    `;

    await sendEmail({ to, from, subject, html });

    return res.render("success-message", {
      message: "Your password has been updated"
    });
  } catch (err) {
    if (err) return next(err);
  }
};

// ################### SETTINGS ##################

exports.display_settings_get = (req, res, next) => {
  res.render("settings");
};
