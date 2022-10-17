"use strict";

// Middleware to redirect from non authenticated index if user has been authenticated

const authCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/home");
  } else {
    next();
  }
};

module.exports = authCheck;
