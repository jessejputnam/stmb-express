"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    membership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true
    },
    active: { type: Boolean, required: true },
    stripeId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);

//! HOW TO MAKE SUBS BE UNIQUE FOR CUSTOMER/CREATOR TIE, SUB GETS ONE MEMBERSHIP?
