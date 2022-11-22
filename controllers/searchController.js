"use strict";

const Page = require("../models/page");

exports.display_all_pages_get = async (req, res, next) => {
  try {
    const pages = await Page.find().populate("genre").exec();
    const activePages = pages.filter((page) => page.active);

    return res.render("search", {
      title: "All Pages",
      page_list: activePages
    });
  } catch (err) {
    return next(err);
  }
};
