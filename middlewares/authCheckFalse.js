"use strict";

// Middleware to redirect from accessing pages meant only for authenticated users

const authCheckFalse = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = authCheckFalse;
