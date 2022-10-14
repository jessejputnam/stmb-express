"use strict";

const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Home" });
});

module.exports = router;
