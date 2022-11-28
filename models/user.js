"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Token = require("../models/token");

// USER MODEL
const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email cannot be empty"],
      match: [/\S+@\S+\.\S+/, "Must be valid email"],
      index: true
    },
    password: { type: String, required: true },
    firstname: { type: String, maxLength: 30, required: true },
    lastname: { type: String, maxLength: 30, required: true },
    region: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },

    creator: {
      name: String,
      genre: String,
      page: { type: Schema.Types.ObjectId, ref: "Page" },
      stripeId: { type: String },
      stripeOnboardComplete: { type: Boolean },
      stripeStatus: { type: String },
      stripeIssue: { type: Boolean }
    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compareSync(plaintext, this.password);
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
  const payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex")
  };

  return new Token(payload);
};

module.exports = mongoose.model("User", UserSchema);
