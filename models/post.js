"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  title: { type: String, maxLength: 50, required: true },
  imgUrl: { type: String },
  text: { type: String, maxLength: 500, required: true },
  link: { type: String }
});

module.exports = mongoose.model("Post", PostSchema);
