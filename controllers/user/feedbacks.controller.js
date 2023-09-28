const Feedback = require("../../models/user/feedbacks.model");
const User = require("../../models/user/feedbacks.model");

//add feedback
const addFeedback = async (req, res) => {
  try {
    let { rating, comment } = req.body;
    const user = req.logedUser;

    if (!user) {
      res.status(500);
      res.send({ status: false, message: "No User" });
    }

    let feedback = {
      userId: req.logedUser._id,
      imageUrl: req.logedUser.imageUrl,
      fullName: req.logedUser.fullName,
      rating: rating,
      comment: comment,
    };

    const newFeedback = new Feedback(feedback);
    await newFeedback.save();

    res.status(200).send({ status: true, feedbacks: newFeedback });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//get feedbacks
const getFeedbacks = async (req, res) => {
  try {
    let number = 0;
    let one = 0,
      oneAndHalf = 0;
    let two = 0,
      twoAndHalf = 0;
    let three = 0,
      threeAndHalf = 0;
    let four = 0,
      fourAndHalf = 0;
    let five = 0;

    const feedbacks = await Feedback.find();

    if (feedbacks.length == 0) {
      res.status(500);
      res.send({ status: false, message: "No Feedbacks" });
    }

    let feedbackCollection = await Feedback.find();
    let num = 0;
    let feedbackCount = feedbackCollection.length;
    let totalRating = 0;
    var averageRating = 0;

    if (feedbackCollection.length != 0) {
      for (num; num < feedbackCollection.length; num++) {
        totalRating = totalRating + feedbackCollection[num].rating;
      }
      let average = totalRating / feedbackCount;
      averageRating = Math.round(average * 10) / 10;
    } else {
      let average = (totalRating + rating) / feedbackCount;
      averageRating = Math.round(average * 10) / 10;
    }

    for (number; number < feedbacks.length; number++) {
      switch (feedbacks[number].rating) {
        case 1:
          one++;
          break;
        case 1.5:
          oneAndHalf++;
          break;
        case 2:
          two++;
          break;
        case 2.5:
          twoAndHalf++;
          break;
        case 3:
          three++;
          break;
        case 3.5:
          threeAndHalf++;
          break;
        case 4:
          four++;
          break;
        case 4.5:
          fourAndHalf++;
          break;
        case 5:
          five++;
          break;
      }
    }
    const ratings = [
      // one: one,
      // oneAndHalf: oneAndHalf,
      // two: two,
      // twoAndHalf: twoAndHalf,
      // three: three,
      // threeAndHalf: threeAndHalf,
      // four: four,
      // fourAndHalf: fourAndHalf,
      // five: five,
      // ratings: feedbacks.length,
      one,
      two,
      three,
      four,
      five,
    ];

    res.status(200).send({
      status: true,
      feedbacks: feedbacks,
      ratings: ratings,
      averageRating: averageRating,
      feedbacksCount: feedbacks.length,
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

// @description   update feedback details by id
// @Action        private
const updateFeedback = async (req, res) => {
  const feedbackID = req.params.feedbackID;
  const { rating, comment } = req.body;

  try {
    const user = req.logedUser;

    if (!user) {
      res.status(500);
      res.send({ status: false, message: "No User" });
    }

    const feedback = await Feedback.findById(feedbackID);
    const fuid = feedback.userId.toString();
    const uid = user._id.toString();

    if (fuid == uid) {
      const updateFeedbck = await Feedback.findOneAndUpdate(
        { _id: feedbackID },
        { rating: rating, comment: comment }
      );
      res.status(200).send({ status: true, feedbacks: updateFeedbck });
    } else {
      res.status(500);
      res.send({ status: false, message: "Invalid User" });
    }
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

// @description   delete feedback details by id
// @Action        private
const deleteFeedback = async (req, res) => {
  const feedbackID = req.params.feedbackID;

  try {
    const feedback = await Feedback.findById(feedbackID);
    if (!feedback) {
      res.status(500);
      res.send({ status: false, message: "There is no feedback" });
    }

    const user = req.logedUser;

    if (!user) {
      res.status(500);
      res.send({ status: false, message: "No User" });
    }

    const fdback = await Feedback.findById(feedbackID);
    const fuid = fdback.userId.toString();
    const uid = user._id.toString();

    if (fuid == uid) {
      const deleteFeedback = await Feedback.findByIdAndDelete(feedbackID);
      res.status(200).send({ status: true, feedbacks: deleteFeedback });
    } else {
      res.status(500);
      res.send({ status: false, message: "Invalid User" });
    }
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

// @description   admin delete feedback details by id
// @Action        private
const adminDeleteFeedback = async (req, res) => {
  const feedbackID = req.params.feedbackID;

  try {
    const feedback = await Feedback.findById(feedbackID);
    if (!feedback) {
      res.status(500);
      res.send({ status: false, message: "There is no feedback" });
    }

    const deleteFeedback = await Feedback.findByIdAndDelete(feedbackID);
    res.status(200).send({ status: true, feedbacks: deleteFeedback });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = {
  addFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  adminDeleteFeedback,
};
