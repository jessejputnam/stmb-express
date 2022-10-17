"use strict";

const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Creator = require("../models/creator");
const Genre = require("../models/genre");
const Page = require("../models/page");

// Display edit page on GET
exports.edit_page_get = async (req, res, next) => {
  // Check if user has permission to edit
  if (req.user.creator._id.toString() !== req.params.id)
    res.redirect(`/${req.params.id}`);

  try {
    const page = await Page.findById(req.params.id);

    res.render("form-page-edit", {
      page: page
    });
  } catch (err) {
    return next(err);
  }
};

// Handle create page on POST
exports.create_page_post = (req, res, next) => {
  const page = new Page({
    creator: req.user.creator,
    pageInfo: {
      title: req.user.creator.title,
      genre: req.user.creator.genre,
      region: req.user.region
    }
  });
};
