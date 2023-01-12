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
  const pg_num = !req.query.page ? 1 : Number(req.query.page);
  // Set limit
  const pagination_limit = 10;

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

    let results_promise;
    let total_results_count_promise;
    let searched_term;

    // Determine if any genre searches are within search term
    const genre_check = searchTerm.split(" ");

    if (genre_check[0] === "browse-genre") {
      results_promise = Page.find({
        genre: genre_check[2],
        active: true
      })
        .limit(pagination_limit)
        .skip((pg_num - 1) * pagination_limit)
        .populate("genre")
        .exec();

      total_results_count_promise = Page.countDocuments({
        genre: genre_check[2],
        active: true
      })
        .populate("genre")
        .exec();

      searched_term = genre_check[1];
    } else {
      results_promise = Page.find({ title: regs, active: true })
        .limit(pagination_limit)
        .skip((pg_num - 1) * pagination_limit)
        .populate("genre")
        .exec();

      total_results_count_promise = Page.countDocuments({
        title: regs,
        active: true
      })
        .populate("genre")
        .exec();

      searched_term = searchTerm;
    }

    const [results, total_results_count] = await Promise.all([
      results_promise,
      total_results_count_promise
    ]);

    const total_pages = Math.ceil(total_results_count / pagination_limit);

    return res.render("pages/search", {
      title: "Find Creators",
      genres,
      pages: results,
      searched_term,
      searchTerm,
      cur_page: pg_num,
      total_pages
    });
  } catch (err) {
    return next(err);
  }
};
