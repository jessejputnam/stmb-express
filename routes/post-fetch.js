"use strict";

const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

router.get("/:id/:limit/:num", post_controller.fetch_posts_get);

module.exports = router;
