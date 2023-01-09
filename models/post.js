"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pageId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },

  public: { type: Boolean, default: false },

  title: { type: String, maxLength: 50, required: true },
  text: { type: String, maxLength: 1000 },
  type: {
    type: String,
    enum: ["text", "link", "video", "image"],
    required: true,
    default: "text"
  },
  typeContent: { type: String, default: null },
  external_link: { type: String, default: null }
});

PostSchema.virtual("readableDate").get(function () {
  return (
    this.timestamp.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }) +
    " at " +
    this.timestamp.toLocaleTimeString()
  );
});

module.exports = mongoose.model("Post", PostSchema);
