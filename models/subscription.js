"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    page: { type: Schema.Types.ObjectId, ref: "Page", required: true },
    membership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true
    },
    status: { type: String, default: "incomplete", required: true },
    stripeSubscriptionId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    temp: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
