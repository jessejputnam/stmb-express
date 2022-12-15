"use strict";

const getRegExps = require("../utils/getSearchRegEx");

const Page = require("../models/page");

// Handle browse all pages on GET
exports.display_all_pages_get = async (req, res, next) => {
  try {
    const pages = await Page.find().populate("genre").exec();
    const activePages = pages.filter((page) => page.active);

    return res.render("browse-menu", {
      title: "All Pages",
      page_list: activePages
    });
  } catch (err) {
    return next(err);
  }
};

// Handle display search form on GET
exports.search_form_get = async (req, res, next) => {
  // console.log(req.url);
  const searchTerm = req.query.searchTerm;

  // Check search containins at least one alphanumeric
  // const containsAlphaNumeric = /[a-zA-Z0-9]/.test(searchTerm);
  // if (!containsAlphaNumeric) {
  //   const err = new Error("Search must contain at least one letter or number");
  //   return next(err);
  // }
  const regs = getRegExps(searchTerm);

  // If no search yet, just display search form
  // if (!regs.length) { // - if implementing array method
  if (!regs) {
    return res.render("form-search", {
      title: "Search for Creator Pages",
      pages: null
    });
  }

  try {
    const results = await Page.find({ title: regs }).populate("genre").exec();
    const activeResults = results.filter((page) => page.active);

    return res.render("form-search", {
      title: "Search Results",
      pages: activeResults
    });
  } catch (err) {
    return next(err);
  }
};
