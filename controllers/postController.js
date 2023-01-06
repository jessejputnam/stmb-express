"use strict";

const { body, validationResult } = require("express-validator");
const ogs = require("open-graph-scraper");

const Post = require("../models/post");

// Handle display posts on GET
exports.posts_display_get = async (req, res, next) => {
  const limit = 2;

  try {
    const posts_promise = Post.find({ user: req.user })
      .sort({ timestamp: "desc" })
      .limit(limit)
      .exec();

    const posts_count_promise = Post.countDocuments({ user: req.user });

    const [posts, posts_count] = await Promise.all([
      posts_promise,
      posts_count_promise
    ]);

    const total_pages = Math.ceil(posts_count / limit);

    return res.render("posts-view", {
      title: "Posts",
      posts: posts,
      limit,
      total_pages
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

  try {
    const post = await Post.findById(postId);

    return res.render("form-post-edit", {
      title: `Edit ${post.type[0].toUpperCase() + post.type.slice(1)} Post`,
      post
    });
  } catch (err) {
    return next(err);
  }
};

exports.edit_post_post = [
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
    const postId = req.params.id;

    const publicAccess = req.body.public === "true" ? true : false;
    const typeContent = req.body.typeContent;
    const title = req.body.title;
    const text = req.body.text;

    try {
      const post = await Post.findById(postId);
      post.title = title;
      post.text = text;
      post.public = publicAccess;
      post.typeContent = typeContent;

      await post.save();

      return res.redirect("/account/posts");
    } catch (err) {
      return next(err);
    }
  }
];

// Handle Open Graph call on GET
exports.open_graph_get = async (req, res, next) => {
  const placeholder_link =
    "https://cdn.iconscout.com/icon/free/png-256/link-3114411-2598189.png";

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
          : placeholder_link
      };
    } else {
      siteInfo = {
        name: "Not Found",
        description: "Not Found",
        url: site,
        img: placeholder_link
      };
    }

    res.send(siteInfo);
  } catch (err) {
    return res.send(siteInfo);
  }
};

exports.delete_post_get = async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    return res.render("confirm-delete-post", {
      post
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_post_delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Post.findByIdAndDelete(id);

    return res.redirect("/account/posts");
  } catch (err) {
    return next(err);
  }
};

// Handle load more posts on GET
exports.fetch_posts_get = async (req, res, next) => {
  const page_id = req.params.id;
  const limit = Number(req.params.limit);
  const page_num = Number(req.params.num);

  console.log([page_id, limit, page_num]);

  const posts = await Post.find({ pageId: page_id })
    .sort({ timestamp: "desc" })
    .limit(limit)
    .skip((page_num - 1) * limit)
    .exec();

  return res.send(posts);
};
