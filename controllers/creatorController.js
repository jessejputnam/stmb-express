"use strict";

const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Genre = require("../models/genre");

// Display become creator on GET
exports.become_creator_get = async (req, res, next) => {
  try {
    const genres = await Genre.find({}, "type").exec();

    if (req.user.creator.name) {
      return res.redirect("/home");
    }

    // Successful, so render
    return res.render("form-become-creator", {
      title: "Become Creator",
      genres: genres
    });
  } catch (err) {
    return next(err);
  }
};

// Handle become creator on POST
exports.become_creator_post = [
  // Validate and sanitize fields
  body("projectName", "Project name required").trim().isLength({ min: 1 }),
  body("genre", "Genre is required").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    // If user already exists
    if (req.user.creator.name) {
      return res.redirect("/home");
    }

    try {
      if (!errors.isEmpty()) {
        // There are errors, rerender
        const genres = await Genre.find({}, "type").exec();

        // Successful, so render
        return res.render("form-become-creator", {
          title: "Become Creator",
          genres: genres
        });
      }

      const user = await User.findById(req.user._id);
      user.creator = {};
      user.creator.name = req.body.projectName;
      user.creator.genre = req.body.genre;
      user.creator.stripeStatus = "pending";
      user.creator.stripeOnboardComplete = false;
      user.creator.stripeIssue = false;

      await user.save();
      return res.redirect("/home");
    } catch (err) {
      return next(err);
    }
  }
];
