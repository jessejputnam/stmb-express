"use strict";

const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

router.get("/:id", post_controller.open_graph_get);

module.exports = router;
