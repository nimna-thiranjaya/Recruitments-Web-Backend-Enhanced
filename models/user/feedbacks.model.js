const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      require: [true, "Full Name is required!"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required!"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required!"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
