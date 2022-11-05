"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema(
  {
    page: { type: Schema.Types.ObjectId, ref: "Page", required: true },
    stripePriceId: { type: String, required: true },
    title: { type: String, minLength: 1, maxLength: 50, required: true },
    imgUrl: String,
    description: { type: String, maxLength: 500 },
    rewards: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);
