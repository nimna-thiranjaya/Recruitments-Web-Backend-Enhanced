const express = require("express");
ApplyJobRouter = express.Router();

const userAuth = require("../../middlewares/user/user.middleware");
const adminAuth = require("../../middlewares/admin/admin.middleware");
const {
  ApplyJob,
  GetAllAppliedJobs,
  GetUserAppliedJobs,
  RemoveAppliedJobs,
} = require("../../controllers/user/appliedJob.controller");

ApplyJobRouter.post("/apply/:jobId", userAuth, ApplyJob);
ApplyJobRouter.get("/getAllAppliedJobs", adminAuth, GetAllAppliedJobs);
ApplyJobRouter.get("/getUserAppliedJobs", userAuth, GetUserAppliedJobs);
ApplyJobRouter.put(
  "/removeAppliedJob/:applyJobId",
  userAuth,
  RemoveAppliedJobs
);
module.exports = ApplyJobRouter;
