"use strict";

const { body, validationResult } = require("express-validator");
const ogs = require("open-graph-scraper");
const s3UploadPost = require("../middlewares/s3UploadPost");

const Post = require("../models/post");

// Handle display posts on GET
exports.posts_display_get = async (req, res, next) => {
  // Set limit
  const pagination_limit = 10;

  try {
    const posts_promise = Post.find({ user: req.user })
      .sort({ timestamp: "desc" })
      .limit(pagination_limit)
      .exec();

    const posts_count_promise = Post.countDocuments({ user: req.user });

    const [posts, posts_count] = await Promise.all([
      posts_promise,
      posts_count_promise
    ]);

    const total_pages = Math.ceil(posts_count / pagination_limit);

    return res.render("pages/posts-view", {
      title: "Posts",
      posts: posts,
      limit: pagination_limit,
      total_pages
    });
  } catch (err) {
    return next(err);
  }
};

// Handle add post on GET
exports.add_post_get = (req, res, next) => {
  const postType = req.url.split("_")[1];
  const imgType = postType === "image" ? req.url.split("_")[2] : null;
  const otherType = imgType === "url" ? "upload" : "url";

  return res.render("forms/post-add", {
    title: "Add Post",
    postType,
    imgType,
    otherType
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
      res.render("forms/post-add", {
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
    const externalLink = req.body.externalLink || null;
    const typeContent = req.body.typeContent;

    const post = new Post({
      user: userId,
      pageId: userPageId,
      public: publicAccess,
      title: req.body.title,
      text: req.body.text,
      type: postType,
      external_link: externalLink,
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

// Handle add image upload post on POST
exports.add_post_upload_post = [
  body("title", "Post title required").trim().isLength({ min: 1 }).escape(),
  body("text").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, rerender
      res.render("forms/post-add", {
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
    const externalLink = req.body.externalLink || null;
    let typeContent =
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";

    const post = new Post({
      user: userId,
      pageId: userPageId,
      public: publicAccess,
      title: req.body.title,
      text: req.body.text,
      type: postType,
      external_link: externalLink,
      typeContent
    });

    // IMAGE UPLOAD
    try {
      const result = await s3UploadPost(req.file, post._id);

      if (result.errorMsg) {
        const err = new Error(result.errorMsg);
        err.status = 404;
        return next(err);
      }

      post.typeContent = result.Location;

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

    return res.render("forms/post-edit", {
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
      res.render("forms/post-add", {
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
    const external_link = req.body.externalLink || null;

    try {
      const post = await Post.findById(postId);
      post.title = title;
      post.text = text;
      post.public = publicAccess;
      post.external_link = external_link;
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
    name: "...",
    description: "...",
    url: site,
    img: "/images/post-placeholder.png"
  };

  try {
    const data = await ogs(options);

    if (data.error === true) {
      return res.send(new Error("There was an error fetching site data"));
    }

    const result = data.result;
    console.log(result);
    if (result.success) {
      let og_image;

      if (result.ogImage) {
        og_image = Array.isArray(result.ogImage)
          ? result.ogImage[0].url
          : result.ogImage.url;
      } else if (result.twitterImage) {
        og_image = Array.isArray(result.twitterImage)
          ? result.twitterImage[0].url
          : result.twitterImage.url;
      } else {
        og_image = placeholder_link;
      }

      siteInfo = {
        name:
          result.ogSiteName ??
          result.ogTitle ??
          result.twitterTitle ??
          "Not Found",
        description: result.ogDescription ?? "Not Found",
        url: result.ogUrl ?? result.requestUrl ?? "Not Found",
        img: og_image
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

    return res.render("confirms/delete-post", {
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
