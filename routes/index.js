"use strict";

const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");

// GET request for landing page.
router.get("/", function (req, res, next) {
  res.render("index", { title: "Smash the Motherboard" });
});

// GET request for register
router.get("/register", auth_controller.signup_get);

// POST request for register
router.post("/register", auth_controller.sign_up_post);

// GET request for login
router.get("/login", auth_controller.login_get);

// POST request for login
router.post("/login", auth_controller.login_post);

module.exports = router;
