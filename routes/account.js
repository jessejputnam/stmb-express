"use strict";

const express = require("express");
const router = express.Router();

const page_controller = require("../controllers/pageController");
const memberships_controller = require("../controllers/membershipController");
const post_controller = require("../controllers/postController");
const stripe_controller = require("../controllers/stripeController");
const subscription_controller = require("../controllers/subscriptionController");

const upload_img = require("../utils/imageUpload");
const upload_img_sm = require("../utils/imageUploadSmall");

/* ------------------ ANALYTICS ---------------- */
// GET request for analytics
router.get("/analytics", subscription_controller.analytics_get);

/* ------------------ STRIPE ONBOARDING ---------------- */

// GET request for Stripe creator onboarding
router.get("/onboard-user", stripe_controller.stripe_onboard_get);

// GET request for refresh_url from accountLink
router.get("/onboard-user/refresh", stripe_controller.stripe_onboard_refresh);

/* -------------------- PAGE EDITING ------------------ */

// POST request for create page
router.post("/create-page", page_controller.create_page_post);

// GET request for edit page
router.get("/edit", page_controller.edit_page_get);

// POST request for edit page
router.post("/edit", page_controller.edit_page_post);

// POST request for change page banner image
router.post(
  "/update/bannerImg",
  upload_img.single("bannerImg"),
  page_controller.set_banner_img_post
);

// POST request for change page profile image
router.post(
  "/update/profileImg",
  upload_img_sm.single("profileImg"),
  page_controller.set_profile_img_post
);

/* -------------------- PAGE VISIBILITY ------------------ */
// GET request for change page active status for search
router.get("/confirm-active", page_controller.page_activate_get);

// POST request for change page active status for search
router.post("/confirm-active", page_controller.page_activate_post);

/* -------------------- MEMBERSHIPS ------------------ */

// GET request for view memberships page
router.get("/memberships", memberships_controller.display_memberships_get);

// GET request for add memberships page
router.get(
  "/memberships/add-membership",
  memberships_controller.add_membership_get
);

// POST request for add membership
router.post(
  "/memberships/add-membership",
  memberships_controller.add_membership_post
);

// GET request for delete membership
router.get(
  "/memberships/:id/delete",
  memberships_controller.delete_membership_get
);

// POST request for delete membership
router.post(
  "/memberships/:id/delete",
  memberships_controller.delete_membership_post
);

/* -------------------- POSTS ------------------ */

// GET request for display all creator's posts
router.get("/posts", post_controller.posts_display_get);

// GET request for add text post
router.get("/posts/add-post_text", post_controller.add_post_get);

// GET request for add link post
router.get("/posts/add-post_link", post_controller.add_post_get);

// GET request for add url image post
router.get("/posts/add-post_image_url", post_controller.add_post_get);

// GET request for add upload image post
router.get("/posts/add-post_image_upload", post_controller.add_post_get);

// GET request for add video post
router.get("/posts/add-post_video", post_controller.add_post_get);

// POST request for add post
router.post("/posts/add-post", post_controller.add_post_post);

// GET request for edit post
router.get("/posts/:id", post_controller.edit_post_get);

// POST request for edit post
router.post("/posts/:id", post_controller.edit_post_post);

// GET request for delete post
router.get("/posts/:id/delete", post_controller.delete_post_get);

// POST request for delete post
router.post("/posts/:id/delete", post_controller.delete_post_delete);

module.exports = router;
