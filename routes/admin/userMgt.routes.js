const express = require("express");
const UserMgtRouter = express.Router();
const adminAuth = require("../../middlewares/admin/admin.middleware");

const {
  GetAllUsers,
  GetSpecificUser,
  DeleteSpecificUser,
  UpdateSpecificUser,
  SetTemporyPassword,
} = require("../../controllers/admin/userMgt.controller");

UserMgtRouter.get("/GetAllUsers", adminAuth, GetAllUsers);
UserMgtRouter.get("/GetOneUser/:id", adminAuth, GetSpecificUser);
UserMgtRouter.delete("/DeleteUser/:id", adminAuth, DeleteSpecificUser);
UserMgtRouter.patch("/UpdateUser/:id", adminAuth, UpdateSpecificUser);
UserMgtRouter.patch("/SetTemporyPassword/:id", adminAuth, SetTemporyPassword);

module.exports = UserMgtRouter;
