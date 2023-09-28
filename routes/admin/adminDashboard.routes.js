const express = require("express");
const DashboardRouter = express.Router();
const adminAuth = require("../../middlewares/admin/admin.middleware");

const {
  GetAllAnalyticalData,
} = require("../../controllers/admin/adminDashboard.controller");

DashboardRouter.get("/data", adminAuth, GetAllAnalyticalData);

module.exports = DashboardRouter;
