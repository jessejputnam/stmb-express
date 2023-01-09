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
  // Get search query
  const searchTerm = req.query.searchTerm;
  // Convert query to regex
  const regs = getRegExps(searchTerm);

  try {
    // Get genres to populate genre browse
    const genres = await Genre.find({});

    // If no search yet, just display search form
    if (!regs) {
      return res.render("pages/search", {
        title: "Find Creators",
        genres,
        pages: null,
        searchedTerm: null
      });
    }

    // Determine if any genre searches are within search term
    const genre_check = searchTerm.split(" ");
    if (genre_check[0] === "browse-genre") {
      const results = await Page.find({ genre: genre_check[2] })
        .populate("genre")
        .exec();
      const activeResults = results.filter((page) => page.active);

      return res.render("pages/search", {
        title: "Find Creators",
        genres,
        pages: activeResults,
        searched_term: genre_check[1]
      });
    }

    const results = await Page.find({ title: regs }).populate("genre").exec();
    const activeResults = results.filter((page) => page.active);

    return res.render("pages/search", {
      title: "Find Creators",
      genres,
      pages: activeResults,
      searched_term: searchTerm
    });
  } catch (err) {
    return next(err);
  }
};
