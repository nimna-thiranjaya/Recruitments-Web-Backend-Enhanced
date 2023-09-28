const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      require: true,
      trim: true,
    },

    companyName: {
      type: String,
      require: true,
      trim: true,
    },

    location: {
      type: String,
      require: true,
      trim: true,
    },

    jobStatus: {
      type: String,
      require: true,
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
      require: true,
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
      require: true,
      trim: true,
    },

    postedDate: {
      type: Date,
      require: true,
      trim: true,
    },

    category: {
      type: String,
      require: true,
    },

    subCategory: {
      type: String,
      require: true,
    },

    expDate: {
      type: Date,
      require: true,
      trim: true,
    },

    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  {
    timestamps: true,
  }
);

const job = mongoose.model("job", jobSchema);
module.exports = job;
