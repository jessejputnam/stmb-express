"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

// USER MODEL
const UserSchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: "Artist" },
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

    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Artist" }]
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
  return bcrypt.compareSync(plaintext, this.password);
};

module.exports = mongoose.model("User", UserSchema);
