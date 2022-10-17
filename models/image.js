"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  type: {
    type: String,
    enum: ["banner", "post", "avatar", "membership"],
    required: true
  },
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model("Image", ImageSchema);
