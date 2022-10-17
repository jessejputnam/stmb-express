"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreatorSchema = new Schema({
  name: { type: String, required: true, maxLength: 75 },
  genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true }
});

module.exports = mongoose.model("Creator", CreatorSchema);
