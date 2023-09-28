const express = require("express");
const NoticeRouter = express.Router();
const adminAuth = require("../../middlewares/admin/admin.middleware");

const {
  CreateNotices,
  GetAllNotices,
  DeleteNotice,
  GEtSpecificNotice,
  UpdateNotice,
  GetAllActiveNotices,
} = require("../../controllers/admin/notice.controller");

NoticeRouter.post("/createNotice", adminAuth, CreateNotices);
NoticeRouter.get("/getNotice", adminAuth, GetAllNotices);
NoticeRouter.get("/getAllActiveNotices", GetAllActiveNotices);
NoticeRouter.delete("/deleteNotice/:id", adminAuth, DeleteNotice);
NoticeRouter.get("/specNotice/:id", GEtSpecificNotice);
NoticeRouter.put("/upNotice/:id", adminAuth, UpdateNotice);

module.exports = NoticeRouter;
