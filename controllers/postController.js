"use strict";

const { body, validationResult } = require("express-validator");

const Post = require("../models/post");

// Handle display posts on GET
exports.posts_display_get = async (req, res, next) => {
  if (String(req.user.creator.page._id) !== req.params.id) {
    return res.redirect("/home");
  }

  try {
    const posts = await Post.find({ user: req.user })
      .sort({ timestamp: "desc" })
      .exec();

    return res.render("posts-view", {
      title: "Posts",
      posts: posts
    });
  } catch (err) {
    return next(err);
  }
};

// Handle add post on GET
exports.add_post_get = (req, res, next) => {
  if (String(req.user.creator.page._id) !== req.params.id) {
    return res.redirect("/home");
  }

  res.render("form-post-edit", {
    title: "Add Post"
  });
};

// Handle add post on POST
exports.add_post_post = [
  body("title", "Post title required").trim().isLength({ min: 1 }).escape(),
  body("text", "Post text required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("form-post-edit", {
        title: "Become Creator",
        errors: errors.array()
      });
      return;
    }

    // No errors, continue
    const userId = req.user._id;
    const userPageId = String(req.user.creator.page._id);
    if (userPageId !== req.params.id) {
      return res.redirect("/home");
    }

    const post = new Post({
      user: userId,
      pageId: userPageId,
      title: req.body.title,
      text: req.body.text
    });

    post.save((err) => {
      if (err) return next(err);

      res.redirect(`/${userPageId}/posts`);
    });
  }
];
