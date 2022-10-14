"use strict";

const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");

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

// POST request for logout
router.post("/home/logout", auth_controller.logout_post);

module.exports = router;
