const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({

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
    require: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
}
);

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
