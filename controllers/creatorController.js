const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Creator = require("../models/creator");
const Genre = require("../models/genre");

// Display become creator on GET
exports.become_creator_get = (req, res, next) => {
  Genre.find({}, "type").exec((err, genres) => {
    if (err) return next(err);

    // Successful, so render
    res.render("form-become-creator", {
      title: "Become Creator",
      genres: genres
    });
  });
};

// Handle become creator on POST
exports.become_creator_post = [
  // Validate and sanitize fields
  body("projectName", "Project name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre", "Genre is required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const creator = new Creator({
      name: req.body.projectName,
      user: req.user._id,
      page: null,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      // There are errors, rerender
      Genre.find({}, "type").exec((err, genres) => {
        if (err) return next(err);

        // Successful, so render
        res.render("form-become-creator", {
          title: "Become Creator",
          genres: genres,
          errors: errors.array()
        });
      });
      return;
    }

    // Check if user already has creator page
    if (req.user.creator) {
      alert(
        "There is already a Creator account associated with this email address"
      );
      res.redirect("/home");
    }

    // Data is valid. Save Creator and update user
    creator.save((err) => {
      if (err) return next(err);
      // Successful, save id to user
      User.findByIdAndUpdate(
        req.user._id,
        { creator: creator._id },
        (err, theuser) => {
          if (err) return next(err);
          else res.redirect("/home");
        }
      );
    });
  }
];
