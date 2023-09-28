const express = require("express");
const SavedjobsRouter = express.Router();
const userAuth = require("../../middlewares/user/user.middleware");

const {
    SaveJob,
    UserSavedJobs,
    DeleteSavedJob

  } = require("../../controllers/user/savedjobs.controller");

  SavedjobsRouter.post("/savejob/:id",userAuth, SaveJob);
  SavedjobsRouter.get("/savedJobs",userAuth, UserSavedJobs);
  SavedjobsRouter.delete("/deleteJob/:id",userAuth, DeleteSavedJob);

module.exports = SavedjobsRouter;