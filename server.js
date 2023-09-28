const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { connection } = require("./utils/dbConnection");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//@import Routes
const AdminRouter = require("./routes/admin/admin.routes");
const UserMgtRouter = require("./routes/admin/userMgt.routes");
const JobRouter = require("./routes/admin/jobMgt.routes");
const NoticeRouter = require("./routes/admin/notice.routes");
const SavedjobsRouter = require("./routes/user/savedjobs.routes");
const UserRouter = require("./routes/user/user.routes");
const ApplyJobRouter = require("./routes/user/appliedJob.routes");
const DashboardRouter = require("./routes/admin/adminDashboard.routes");
const FeedbacksRoutes = require("./routes/user/feedbacks.routes");

//@Use Routes
app.use("/api/admin", AdminRouter);
app.use("/api/userMgt", UserMgtRouter);
app.use("/api/jobMgt", JobRouter);
app.use("/api/notice", NoticeRouter);
app.use("/api/user", UserRouter);
app.use("/api/applyJob", ApplyJobRouter);
app.use("/api/dashboard", DashboardRouter);
app.use("/api/feedbacks", FeedbacksRoutes);

app.use("/api/savedjobs", SavedjobsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
  connection();
});
