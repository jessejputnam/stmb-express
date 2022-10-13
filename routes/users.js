"use strict";

const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/profile", function (req, res, next) {
  res.render("user_profile", { title: "User Profile" });
});

module.exports = router;
