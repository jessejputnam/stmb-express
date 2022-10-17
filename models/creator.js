"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreatorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  page: {
    type: Schema.Types.ObjectId,
    ref: "Page",
    default: null
  },
  genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },

  subscibers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Creator", CreatorSchema);
