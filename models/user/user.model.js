const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
    },

    lastName: {
      type: String,
      require: true,
      trim: true,
    },

    fullName: {
      type: String,
      require: true,
      trim: true,
    },

    email: {
      type: String,
      require: true,
      trim: true,
    },

    phoneNo: {
      type: String,
      require: true,
      trim: true,
    },

    password: {
      type: String,
      require: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    dob: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    heading: {
      type: String,
      trim: true,
    },

    fburl: {
      type: String,
      trim: true,
    },

    instaurl: {
      type: String,
      trim: true,
    },

    lnkdinurl: {
      type: String,
      trim: true,
    },

    pturl: {
      type: String,
      trim: true,
    },

    tturl: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
    },

    cv: {
      type: String,
    },

    status: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      require: true,
      default: false,
    },

    tokens: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
