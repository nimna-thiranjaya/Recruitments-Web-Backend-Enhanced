const mongoose = require("mongoose");
const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },

    imageUrlPoster: {
      type: String,
      required: [true, "Image is required!"],
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
      required: [true, "Posted Date is required!"],
      trim: true,
    },
    expDate: {
      type: Date,
      required: [true, "Expire Date is required!"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const notice = mongoose.model("notice", noticeSchema);
module.exports = notice;
