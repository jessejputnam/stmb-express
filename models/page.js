"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema({
  creatorId: { type: String, required: true },
  title: { type: String, maxLength: 50, required: true },
  genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
  region: { type: String, required: true },
  description: { type: String },
  socialUrls: {
    facebookHandle: { type: String },
    instagramHandle: { type: String },
    twitterHandle: { type: String }
  },

  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

  imgUrls: {
    banner: { type: String, default: "images/banner-placeholder" },
    avatar: { type: String, default: "images/avatar-placeholder.svg" }
  },

  tiers: {
    top: { type: Schema.Types.ObjectId, ref: "Membership" },
    middle: {
      type: Schema.Types.ObjectId,
      ref: "Membership"
    },
    bottom: { type: Schema.Types.ObjectId, ref: "Membership" }
  }
});

PageSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Page", PageSchema);
