"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    active: { type: Boolean, required: true, default: true },
    title: { type: String, maxLength: 50, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre", required: true }],
    region: { type: String, required: true },
    description: { type: String },
    socialUrls: {
      facebookHandle: { type: String },
      instagramHandle: { type: String },
      twitterHandle: { type: String }
    },
    bannerImg: {
      type: String,
      default: "images/pages/banner-placeholder.jpeg"
    },
    profileImg: { type: String, default: "images/pages/avatar-placeholder.svg" }
  },
  { timestamps: true }
);

PageSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Page", PageSchema);
