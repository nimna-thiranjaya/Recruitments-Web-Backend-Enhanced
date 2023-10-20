const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const savedjobs = require("../../models/job/savedjobs.model");
const Jobs = require("../../models/admin/job.model");
const BadRequestError = require("../../error/error.classes/BadRequestError");

//save jobs============================================
const SaveJob = async (req, res) => {
  try {
    const jobID = escape(req.params.id);
    console.log("--------------------------------------------");
    console.log("Print From Save Job :", jobID);
    console.log("--------------------------------------------");
    const userID = req.logedUser._id;
    const jobDetails = await Jobs.findById(jobID);

    const job = await savedjobs.find({ jobID: jobID });
    const isArray = job[0] == undefined;

    if (!job || isArray) {
      data = {
        jobID,
        userID,
        jobDetails,
      };

      await savedjobs.create(data);
      return res
        .status(200)
        .send({ status: true, message: "Job saved successful" });
    } else {
      throw new BadRequestError("Job already exists.!");
    }
  } catch (err) {
    throw err;
  }
};

//get user saved jobs======================================
const UserSavedJobs = async (req, res) => {
  try {
    const userId = req.logedUser._id;

    const savedJobs = await savedjobs.find({ userID: userId });

    return res.status(200).send({ success: true, jobs: savedJobs });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//Delete saved job======================================
const DeleteSavedJob = async (req, res) => {
  const job = await savedjobs.findOneAndDelete({ jobID: req.params.id });

  if (job) {
    return res
      .status(200)
      .send({ status: true, message: "Saved Job deleted successfully" });
  } else {
    return res.status(404).send({
      success: false,
      message: "Job not found",
    });
  }
};

module.exports = {
  SaveJob,
  UserSavedJobs,
  DeleteSavedJob,
};
