const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

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
    profile: {
      firstname: { String },
      lastname: { String },
      //! Fix regions to be specific -- ask Ed for guidance
      region: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
