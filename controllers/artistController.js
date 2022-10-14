const { body, validationResult } = require("express-validator");
const async = require("async");

const User = require("../models/user");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Page = require("../models/page");

// Display become creator on GET
exports.become_creator_get = (req, res, next) => {
  Genre.find({}, "type").exec((err, genres) => {
    if (err) return next(err);

    // Successful, so render
    res.render("become-artist", { title: "Become Creator", genres: genres });
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
  body("desc", "Decription should be less than 500 characters")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 500 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const artist = new Artist({
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
        res.render("become-artist", {
          title: "Become Creator",
          genres: genres,
          errors: errors.array()
        });
      });
      return;
    }

    // Check if user already has artist page
    if (req.user.artist) {
      alert(
        "There is already an artist account associated with this email address"
      );
      res.redirect("/home");
    }

    // Data is valid. Save Artist and update user
    artist.save((err) => {
      if (err) return next(err);
      // Successful, save id to user
      User.findByIdAndUpdate(
        req.user._id,
        { artist: artist._id },
        (err, theuser) => {
          if (err) return next(err);
          else res.redirect("/home");
        }
      );
    });
  }
];
