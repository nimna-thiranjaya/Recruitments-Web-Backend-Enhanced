const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    facebookId: { type: String },
    firstName: {
      type: String,
      required: [true, "Full Name is required!"],
      maxlength: [50, "First Name should be less than 50 characters!"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last Name is required!"],
      maxlength: [50, "Last Name should be less than 50 characters!"],
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full Name is required!"],
      maxlength: [100, "Full Name should be less than 100 characters!"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      maxlength: [100, "Email should be less than 100 characters!"],
      validate: {
        validator: (value) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: "Invalid email address!",
      },
    },

    phoneNo: {
      type: String,
      trim: true,
      maxlength: [10, "Phone Number should be less than 10 characters!"],
      validate: {
        validator: (value) => {
          return /^[0-9]{10}$/.test(value);
        },
        message: "Invalid phone number!",
      },
    },

    password: {
      type: String,
      trim: true,
      minlength: [6, "Password should be more than 6 characters!"],
    },

    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
            value
          );
        },
        message: "Invalid Portfolio URL!",
      },
    },

    dob: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      maxlength: [100, "Address should be less than 100 characters!"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description should be less than 500 characters!"],
    },

    heading: {
      type: String,
      trim: true,
      maxlength: [100, "Heading should be less than 100 characters!"],
    },

    fburl: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_.-]+\/?$/.test(
      //       value
      //     );
      //   },
      //   message: "Invalid Facebook URL!",
      // },
    },

    instaurl: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?$/.test(
      //       value
      //     );
      //   },
      //   message: "Invalid Instagram URL!",
      // },
    },

    lnkdinurl: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return /^(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9_.-]+\/?$/.test(
      //       value
      //     );
      //   },
      //   message: "Invalid Linkedin URL!",
      // },
    },

    pturl: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
      //       value
      //     );
      //   },
      //   message: "Invalid Portfolio URL!",
      // },
    },

    tturl: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_.-]+\/?$/.test(
      //       value
      //     );
      //   },
      //   message: "Invalid Twitter URL!",
      // },
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
    versionKey: false,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
