"use strict";

const express = require("express");
const router = express.Router();

const search_controller = require("../controllers/searchController");

router.get("/", search_controller.display_all_pages_get);

module.exports = router;
