"use strict";

const express = require("express");
const router = express.Router();

const authCheckFalse = require("../middlewares/authCheckFalse");
const authCheck = require("../middlewares/authCheck");

const auth_controller = require("../controllers/authController");
const creator_controller = require("../controllers/creatorController");
const page_controller = require("../controllers/pageController");
const memberships_controller = require("../controllers/membershipController");
const post_controller = require("../controllers/postController");

// GET request for user home
router.get("/home", authCheckFalse, function (req, res, next) {
  res.render("user-home", { title: "Home" });
});

/* -------------------- Landing Page ------------------ */
// GET request for landing page.
router.get("/", authCheck, auth_controller.index_get);

/* -------------------- Authentication ---------------- */
// GET request for register
router.get("/register", authCheck, auth_controller.signup_get);

// POST request for register
router.post("/register", auth_controller.sign_up_post);

// GET request for login
router.get("/login", authCheck, auth_controller.login_get);

// POST request for login
router.post("/login", auth_controller.login_post);

// GET request for logout
router.get("/logout", auth_controller.logout_get);

/* -------------------- Become Creator ------------------ */
// GET request for become creator
router.get(
  "/creator-signup",
  authCheckFalse,
  creator_controller.become_creator_get
);

// POST request for become creator
router.post(
  "/creator-signup",
  authCheckFalse,
  creator_controller.become_creator_post
);

/* -------------------- Page Views ------------------ */
// POST request for create page
router.post("/create-page", authCheckFalse, page_controller.create_page_post);

// GET request for view page
router.get("/:id", page_controller.page_get);

// GET request for edit page
router.get("/:id/edit", authCheckFalse, page_controller.edit_page_get);

// POST request for edit page
router.post("/:id/edit", authCheckFalse, page_controller.edit_page_post);

/* ----------------- Membership Page --------------- */
// GET quest for view memberships page
router.get(
  "/:id/memberships",
  authCheckFalse,
  memberships_controller.display_memberships_get
);

// GET quest for add memberships page
router.get(
  "/:id/add-membership",
  authCheckFalse,
  memberships_controller.add_membership_get
);

// POST request for add membership
router.post(
  "/:id/add-membership",
  authCheckFalse,
  memberships_controller.add_membership_post
);

/* ----------------- Posts Page --------------- */
// GET request for display all creator's posts
router.get("/:id/posts", post_controller.posts_display_get);

// GET request for add post
router.get("/:id/add-post", authCheckFalse, post_controller.add_post_get);

// POST request for add post
router.post("/:id/add-post", authCheckFalse, post_controller.add_post_post);

module.exports = router;
