"use strict";

const { body, validationResult } = require("express-validator");
const ogs = require("open-graph-scraper");

const Post = require("../models/post");

// Handle display posts on GET
exports.posts_display_get = async (req, res, next) => {
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
  const postType = req.url.split("_")[1];

  return res.render("form-post-add", {
    title: "Add Post",
    postType
  });
};

// Handle add post on POST
exports.add_post_post = [
  body("title", "Post title required").trim().isLength({ min: 1 }).escape(),
  body("text").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("form-post-add", {
        title: "Add Post",
        errors: errors.array()
      });
      return;
    }

    // No errors, continue
    const userId = req.user._id;
    const userPageId = String(req.user.creator.page._id);
    const postType = req.body.postType;
    const publicAccess = req.body.isPublic;
    const typeContent = req.body.typeContent;

    const post = new Post({
      user: userId,
      pageId: userPageId,
      public: publicAccess,
      title: req.body.title,
      text: req.body.text,
      type: postType,
      typeContent
    });

    try {
      await post.save();

      return res.redirect("/account/posts");
    } catch (err) {
      return next(err);
    }
  }
];

// Handle edit post on GET
exports.edit_post_get = async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  return res.render("form-post-edit", {
    title: "Edit Post",
    post
  });
};

// Handle Open Graph call on GET
exports.open_graph_get = async (req, res, next) => {
  const site = req.params.id;
  const options = { url: site };

  let siteInfo = {
    name: "Not Found",
    description: "Not Found",
    url: site,
    img: "/images/post-placeholder.png"
  };

  try {
    const data = await ogs(options);

    if (data.error === true) {
      return res.send(new Error("There was an error fetching site data"));
    }

    const result = data.result;
    if (data.result.success) {
      siteInfo = {
        name:
          result.ogSiteName ??
          result.ogTitle ??
          result.twitterTitle ??
          "Not Found",
        description: result.ogDescription ?? "Not Found",
        url: result.ogUrl ?? result.requestUrl ?? "Not Found",
        img: result.ogImage
          ? result.ogImage.url
          : result.twitterImage
          ? result.twitterImage.url
          : "/images/post-placeholder.png"
      };
    } else {
      siteInfo = {
        name: "Not Found",
        description: "Not Found",
        url: site,
        img: "/images/post-placeholder.png"
      };
    }

    res.send(siteInfo);
  } catch (err) {
    return res.send(siteInfo);
  }
};
