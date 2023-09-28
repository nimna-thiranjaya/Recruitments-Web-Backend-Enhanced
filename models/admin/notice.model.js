const mongoose = require("mongoose");
const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },

    description: {
      type: String,
      require: true,
      trim: true,
    },

    imageUrlPoster: {
      type: String,
      require: true,
      trim: true,
    },

    imageUrlIcon: {
      type: String,
      trim: true,
    },
    noticeStatus: {
      type: String,
      trim: true,
    },
    postedDate: {
      type: Date,
      require: true,
      trim: true,
    },
    expDate: {
      type: Date,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const notice = mongoose.model("notice", noticeSchema);
module.exports = notice;
