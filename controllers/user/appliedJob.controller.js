const User = require("../../models/user/user.model");
const AppliedJob = require("../../models/user/appliedJob.model");
const Job = require("../../models/admin/job.model");
const { SendEmail } = require("../../utils/emailConnection");

const ApplyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const LogedUser = req.logedUser;
    const { userResumeUrl, emailSubject, emailbody, fullname } = req.body;

    const jobStatusCheck = await AppliedJob.findOne({
      userId: LogedUser._id,
      jobId: jobId,
    });

    if (!jobStatusCheck) {
      const currentJob = await Job.findById(jobId);

      let mailDetails = {
        from: process.env.EMAIL_USERNAME,
        to: currentJob.comEmail,
        subject: emailSubject,
        html: `<div>${emailbody}</div><br/>
        <div> CV Link : ${userResumeUrl} ${fullname}</div>`,
      };

      SendEmail(mailDetails);

      const applyJobData = {
        userId: LogedUser._id,
        jobId: jobId,
        userResumeUrl: userResumeUrl,
        appliedJobTitle: currentJob.jobTitle,
        appliedJobImageUrl: currentJob.descImgUrl,
        appliedJobCategory: currentJob.category,
        appliedJobSubCategory: currentJob.subCategory,
        appliedCompanyName: currentJob.companyName,
        appliedJobStatus: currentJob.jobStatus,
        appliedCompanyLocation: currentJob.location,
        appliedCompanyEmail: currentJob.comEmail,
        appliedUser: LogedUser,
      };

      const appliedJob = await AppliedJob.create(applyJobData);

      if (appliedJob) {
        return res.status(200).send({ status: true, message: "Job Apply" });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Somthing Went Wrong !" });
      }
    } else {
      return res.status(400).send({
        status: false,
        message: "You have already Apply to this Job !",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetAllAppliedJobs = async (req, res) => {
  try {
    const AllAppliedJobs = await AppliedJob.find().sort({ createdAt: -1 });

    if (AllAppliedJobs) {
      return res
        .status(200)
        .send({ status: true, appliedjobs: AllAppliedJobs });
    } else {
      return res.status(400).send({
        status: false,
        message: "Somthing Went Wrong !",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const GetUserAppliedJobs = async (req, res) => {
  try {
    const LogedUser = req.logedUser;

    const userAppliedJobs = await AppliedJob.find({
      userId: LogedUser._id,
    }).sort({ createdAt: -1 });

    if (userAppliedJobs) {
      return res
        .status(200)
        .send({ status: true, userAppliedjobs: userAppliedJobs });
    } else {
      return res.status(400).send({
        status: false,
        message: "Somthing Went Wrong !",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const RemoveAppliedJobs = async (req, res) => {
  try {
    const id = req.params.applyJobId;

    const removeStatus = await AppliedJob.findByIdAndUpdate(id, {
      appliedJobStatus: "Expired",
    });

    if (removeStatus) {
      return res.status(200).send({
        status: false,
        message: "Job Removed !",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Somthing Went Wrong !",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = {
  ApplyJob,
  GetAllAppliedJobs,
  GetUserAppliedJobs,
  RemoveAppliedJobs,
};
