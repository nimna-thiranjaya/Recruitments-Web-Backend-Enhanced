const mongoose = require("mongoose");

const appliedJobSchema = new mongoose.Schema(
  {
    //user Details
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },

    userResumeUrl: {
      type: String,
      trim: true,
    },

    //Applied Job Details
    appliedJobTitle: {
      type: String,
      trim: true,
    },

    appliedJobImageUrl: {
      type: String,
      trim: true,
    },

    appliedJobCategory: {
      type: String,
      trim: true,
    },

    appliedJobSubCategory: {
      type: String,
      trim: true,
    },

    appliedCompanyName: {
      type: String,
      trim: true,
    },

    appliedCompanyLocation: {
      type: String,
      trim: true,
    },

    appliedCompanyEmail: {
      type: String,
      trim: true,
    },

    appliedJobStatus: {
      type: String,
      trim: true,
    },
    appliedUser: { type: Object },
  },
  {
    timestamps: true,
  }
);

const appliedJob = mongoose.model("appliedJob", appliedJobSchema);
module.exports = appliedJob;
