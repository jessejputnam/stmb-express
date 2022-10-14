"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  type: {
    type: String,
    enum: [
      "podcast",
      "video",
      "music",
      "visual",
      "writing",
      "gaming",
      "nonprofit",
      "education"
    ],
    required: true
  }
});

GenreSchema.virtual("url").get(function () {
  return `/genres/${this._id}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
