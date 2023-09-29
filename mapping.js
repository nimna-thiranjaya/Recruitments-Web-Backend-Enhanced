const AdminRouter = require("./routes/admin/admin.routes");
const DashboardRouter = require("./routes/admin/adminDashboard.routes");
const JobRouter = require("./routes/admin/jobMgt.routes");
const NoticeRouter = require("./routes/admin/notice.routes");
const UserMgtRouter = require("./routes/admin/userMgt.routes");
const FeedbacksRoutes = require("./routes/user/feedbacks.routes");
const SavedjobsRouter = require("./routes/user/savedjobs.routes");
const UserRouter = require("./routes/user/user.routes");
const ApplyJobRouter = require("./routes/user/appliedJob.routes");
const AuthRouter = require("./routes/user/auth.routes");

const RequestMapping = (app) => {
  app.use("/api/admin", AdminRouter);
  app.use("/api/userMgt", UserMgtRouter);
  app.use("/api/jobMgt", JobRouter);
  app.use("/api/notice", NoticeRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/applyJob", ApplyJobRouter);
  app.use("/api/dashboard", DashboardRouter);
  app.use("/api/feedbacks", FeedbacksRoutes);
  app.use("/api/savedjobs", SavedjobsRouter);
  app.use("/auth", AuthRouter);
};

module.exports = RequestMapping;
