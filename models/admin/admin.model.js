const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
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

    profileImagePath: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
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

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
