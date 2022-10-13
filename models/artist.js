"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  page: { type: Schema.Types.ObjectId, ref: "Page", required: true },
  subscibers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  socials: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    website: { type: String }
  }
});

module.exports = mongoose.model("Artist", ArtistSchema);
