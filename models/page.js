"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = new Schema({
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  pageInfo: {
    title: { type: String, maxLength: 50, required: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    region: { type: String, required: true },
    description: { type: String, required: true },
    socialUrls: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      website: { type: String }
    },

    imgUrls: {
      banner: { type: String, default: "images/banner-placeholder" },
      avatar: { type: String, default: "images/avatar-placeholder.svg" }
    },

    tiers: {
      top: { type: Schema.Types.ObjectId, ref: "Membership", required: true },
      middle: {
        type: Schema.Types.ObjectId,
        ref: "Membership",
        required: true
      },
      bottom: { type: Schema.Types.ObjectId, ref: "Membership", required: true }
    },

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
  }
});

PageSchema.virtual("url").get(function () {
  return `/artists/${this._id}`;
});

module.exports = mongoose.model("Page", PageSchema);
