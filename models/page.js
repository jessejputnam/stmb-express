"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, maxLength: 50, required: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    region: { type: String, required: true },
    description: { type: String },
    socialUrls: {
      facebookHandle: { type: String },
      instagramHandle: { type: String },
      twitterHandle: { type: String }
    },

    imgUrls: {
      banner: { type: String, default: "images/banner-placeholder.jpeg" },
      avatar: { type: String, default: "images/avatar-placeholder.svg" }
    }
  },
  { timestamps: true }
);

PageSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Page", PageSchema);
