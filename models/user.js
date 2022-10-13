"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

// Email Validation Schema for User model
const Email = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true
  },
  validated: { type: Boolean, default: false }
});

// USER MODEL
const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    password: { type: String, required: true },
    email: { type: Email, required: true },

    subscriptions: [{ type: Schema.Types.ObjectId, ref: "" }],

    profile: {
      firstname: { type: String, maxLength: 30, required: true },
      lastname: { type: String, maxLength: 30, required: true },
      region: { type: String, required: true }
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

UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", UserSchema);
