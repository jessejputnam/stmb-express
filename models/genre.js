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

GenreSchema.virtual("displayType").get(function () {
  return this.type[0].toUpperCase() + this.type.slice(1);
});

module.exports = mongoose.model("Genre", GenreSchema);
