const express = require("express");
const JobRouter = express.Router();
const adminAuth = require("../../middlewares/admin/admin.middleware");

const {
  CreateNewJob,
  DeleteJob,
  GetAllActiveJobs,
  GetAllJobs,
  UpdateJob,
  GetSpecificJob,
  filterJobs,
} = require("../../controllers/admin/jobMgt.controller");

JobRouter.post("/CreateJob", adminAuth, CreateNewJob);
JobRouter.delete("/DeleteJob/:id", adminAuth, DeleteJob);
JobRouter.get("/GetAllActiveJobs", GetAllActiveJobs);
JobRouter.get("/GetAllJobs", adminAuth, GetAllJobs);
JobRouter.get("/GetSpecificJob/:id", GetSpecificJob);
JobRouter.patch("/UpdateJob/:id", adminAuth, UpdateJob);
JobRouter.get("/filterJobs/:category", adminAuth, filterJobs);
module.exports = JobRouter;
