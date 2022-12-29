"use strict";

const getRegExps = require("../utils/getSearchRegEx");

const Page = require("../models/page");
const Genre = require("../models/genre");

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
  const searchTerm = req.query.searchTerm;

  const regs = getRegExps(searchTerm);

  try {
    const genres = await Genre.find({});
    console.log(genres);

    // If no search yet, just display search form
    if (!regs) {
      return res.render("form-search", {
        title: "Find Creators",
        genres,
        pages: null
      });
    }

    const results = await Page.find({ title: regs }).populate("genre").exec();
    const activeResults = results.filter((page) => page.active);

    return res.render("form-search", {
      title: "Find Creators",
      pages: activeResults
    });
  } catch (err) {
    return next(err);
  }
};
