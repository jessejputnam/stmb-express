const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const Genre = require("../models/genre");

// Display become creator on GET
exports.become_creator_get = (req, res, next) => {
  Genre.find({}, "type").exec((err, genres) => {
    if (err) return next(err);

    if (req.user.creator.name) {
      return res.redirect("/home");
    }

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
    if (req.user.creator.name) {
      return res.redirect("/home");
    }

    if (!errors.isEmpty()) {
      // There are errors, rerender
      Genre.find({}, "type").exec((err, genres) => {
        if (err) return next(err);

        res.render("form-become-creator", {
          title: "Become Creator",
          genres: genres,
          errors: errors.array()
        });
      });
      return;
    }

    User.findById(req.user._id, (err, result) => {
      if (err) return next(err);

      const user = result;

      user.creator = {};
      user.creator.name = req.body.projectName;
      user.creator.genre = req.body.genre;

      result.save((err, theuser) => {
        if (err) return next(err);
        res.redirect("/home");
      });
    });
  }
];
