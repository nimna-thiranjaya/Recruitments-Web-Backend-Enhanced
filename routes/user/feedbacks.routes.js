const express = require("express");
const FeedbacksRoutes = express.Router();
const userAuth = require("../../middlewares/user/user.middleware");

const {
  addFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  adminDeleteFeedback
} = require("../../controllers/user/feedbacks.controller");

FeedbacksRoutes.post("/addFeedback", userAuth, addFeedback);
FeedbacksRoutes.get("/getFeedbacks", getFeedbacks);
FeedbacksRoutes.put("/updateFeedback/:feedbackID", userAuth, updateFeedback);
FeedbacksRoutes.delete("/deleteFeedback/:feedbackID", userAuth, deleteFeedback);
FeedbacksRoutes.delete("/adminDeleteFeedback/:feedbackID", adminDeleteFeedback);

module.exports = FeedbacksRoutes;
