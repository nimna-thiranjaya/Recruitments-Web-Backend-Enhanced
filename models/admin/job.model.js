const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required!"],
      trim: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required!"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required!"],
      trim: true,
    },

    jobStatus: {
      type: String,
      required: [true, "Job status is required!"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    descImgUrl: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
    },

    requirement: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      require: true,
      trim: true,
    },

    comEmail: {
      type: String,
      required: [true, "Company email is required!"],
      validate: {
        validator: function (v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props) => `Invalid email address!`,
      },
      trim: true,
    },

    facebookUrl: {
      type: String,
      trim: true,
    },

    linkedInUrl: {
      type: String,
      trim: true,
    },

    twitterUrl: {
      type: String,
      trim: true,
    },

    webSiteUrl: {
      type: String,
      required: [true, "Web site url is required!"],
      trim: true,
    },

    postedDate: {
      type: Date,
      required: [true, "Posted date is required!"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required!"],
    },

    subCategory: {
      type: String,
      required: [true, "Sub category is required!"],
    },

    expDate: {
      type: Date,
      required: [true, "Expire date is required!"],
      trim: true,
    },

    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const job = mongoose.model("job", jobSchema);
module.exports = job;
