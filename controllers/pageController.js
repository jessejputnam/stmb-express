"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Creator = require("../models/creator");
const Genre = require("../models/genre");
const Page = require("../models/page");

// Display page of GET
exports.page_get = (req, res, next) => {
  Creator.findById(req.params.id);
};

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      const err = new Error("Page does not exist");
      err.status = 404;
      return next(err);
    } else {
      // Check if user has permission to edit
      if (req.user.creator._id.toString() !== page.creatorId)
        res.redirect(`/${req.params.id}`);

      // Successful, so render
      res.render("form-page-edit", {
        title: "Edit Page",
        page: page
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Handle create page on POST
exports.create_page_post = async (req, res, next) => {
  try {
    const creator = await Creator.findById(req.user.creator);
    const genre = await Genre.findById(creator.genre);
    console.log(genre);

    const page = new Page({
      url: `/${creator._id}`,
      title: creator.name,
      genre: creator.genre,
      region: req.user.region
    });

    page.save((err) => {
      if (err) return next(err);

      // Update creator obj to point to page
      creator.page = page;
      creator.save((err) => {
        if (err) return next(err);
        res.redirect(page.url);
      });
    });
  } catch (err) {
    return next(err);
  }
};

// Handle edit page on PUT
exports.edit_page_put = (req, res, next) => {};
