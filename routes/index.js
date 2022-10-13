"use strict";

const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const CheckSchema = new Object({
    name: "Lance",
    position: "Master",
    func(variable, callback) {
      console.log(variable);
      console.log("Func", this);
      console.log("Callback", callback);
    }
  });

  CheckSchema.func("var", () => {
    return this.name;
  });
  // console.log(CheckSchema);
  res.render("index", { title: "Smash the Motherboard" });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Log In" });
});

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Register" });
});

module.exports = router;
