"use strict";

const isVerifiedCheck = (req, res, next) => {
  if (req.user && !req.user.isVerified) {
    return res.redirect("/home/not-verified");
  } else {
    next();
  }
};

module.exports = isVerifiedCheck;
