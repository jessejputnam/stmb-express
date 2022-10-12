var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Smash the Motherboard" });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Log In" });
});

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Register" });
});

module.exports = router;
