var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/profile", function (req, res, next) {
  res.render("user_profile", { title: "User Profile" });
});

module.exports = router;
