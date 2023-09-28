const User = require("../../models/user/user.model");
const ApplyJob = require("../../models/user/appliedJob.model");
const Job = require("../../models/admin/job.model");
const Notices = require("../../models/admin/notice.model");
const Feedback = require("../../models/user/feedbacks.model");
const GetAllAnalyticalData = async (req, res) => {
  try {
    const activeUsers = await User.find({ verified: true });
    const activeJobs = await Job.find({ jobStatus: "Active" });
    const appliedJobs = await ApplyJob.find();
    const notices = await Notices.find({ noticeStatus: "Active" }).sort({
      createdAt: -1,
    });
    const feedbacks = await Feedback.find();
    const valnotices = [];

    if (notices.length > 1) {
      valnotices.push(notices[0]);
      valnotices.push(notices[1]);
    } else if (notices.length > 0) {
      valnotices.push(notices[0]);
    } else {
      valnotices = [];
    }

    const data = {
      activeUsers: activeUsers.length,
      activeJobs: activeJobs.length,
      appliedJobs: appliedJobs.length,
      feedbacks: feedbacks.length,
      notices: valnotices,
    };

    return res.status(200).send({ status: true, analytics: data });
  } catch (err) {
    return res.status(404).send({
      success: false,
      message: "Job not found",
    });
  }
};

module.exports = { GetAllAnalyticalData };
