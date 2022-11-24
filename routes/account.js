"use strict";

const express = require("express");
const router = express.Router();

const page_controller = require("../controllers/pageController");
const memberships_controller = require("../controllers/membershipController");
const post_controller = require("../controllers/postController");
const stripe_controller = require("../controllers/stripeController");

const upload_img = require("../utils/imageUpload");

/* ------------------ STRIPE ONBOARDING ---------------- */

// GET request for Stripe creator onboarding
router.get("/onboard-user", stripe_controller.stripe_onboard_get);

// GET request for refresh_url from accountLink
router.get("/onboard-user/refresh", stripe_controller.stripe_onboard_refresh);

/* -------------------- PAGE EDITING ------------------ */

// POST request for create page
router.post("/create-page", page_controller.create_page_post);

// GET request for edit page
router.get("/:id/edit", page_controller.edit_page_get);

// POST request for edit page
router.post("/:id/edit", page_controller.edit_page_post);

// POST request for change page banner image
router.post(
  "/:id/update/bannerImg",
  upload_img.single("bannerImg"),
  // upload_img("banner").single("bannerImg"),
  page_controller.set_banner_img_post
);

// POST request for change page profile image
// router.post("/:id/update/profileImg", upload_controller.upload_page_img_post);

/* -------------------- PAGE VISIBILITY ------------------ */
// GET request for change page active status for search
router.get("/:id/confirm-active", page_controller.page_activate_get);

// POST request for change page active status for search
router.post("/:id/confirm-active", page_controller.page_activate_post);

/* -------------------- MEMBERSHIPS ------------------ */

// GET request for view memberships page
router.get("/:id/memberships", memberships_controller.display_memberships_get);

// GET request for add memberships page
router.get("/:id/add-membership", memberships_controller.add_membership_get);

// POST request for add membership
router.post("/:id/add-membership", memberships_controller.add_membership_post);

// GET request for delete membership
router.get(
  "/:id/delete-membership/:memberid",
  memberships_controller.delete_membership_get
);

// POST request for delete membership
router.post(
  "/:id/delete-membership/:memberid",
  memberships_controller.delete_membership_post
);

/* -------------------- POSTS ------------------ */

// GET request for display all creator's posts
router.get("/:id/posts", post_controller.posts_display_get);

// GET request for add post
router.get("/:id/add-post", post_controller.add_post_get);

// POST request for add post
router.post("/:id/add-post", post_controller.add_post_post);

module.exports = router;
