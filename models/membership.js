"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "Creator", required: true },
    price: { type: Number, min: 1, max: 999, required: true },
    title: { type: String, minLength: 1, maxLength: 50, required: true },
    imgUrl: String,
    description: { type: String, maxLength: 500 },
    rewards: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);
