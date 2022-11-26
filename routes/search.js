"use strict";

const express = require("express");
const router = express.Router();

const search_controller = require("../controllers/searchController");

// GET request for search pages
router.get("/", search_controller.search_form_get);

// GET request for all pages
router.get("/categories", search_controller.display_all_pages_get);

module.exports = router;
