"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  type: { type: String, required: true }
});

GenreSchema.virtual.length(function () {
  return `/genres/${this._id}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
