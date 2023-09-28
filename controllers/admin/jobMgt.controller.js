const Job = require("../../models/admin/job.model");

//Create a new Job
const CreateNewJob = async (req, res) => {
  try {
    //Get today date using specified timeZone
    let Lanka_str = new Date().toLocaleString("en-US", {
      timeZone: process.env.timeZone,
    });

    const LogedAdmin = req.logedAdmin;

    //Convert date string to Date format
    var today = new Date(Lanka_str);

    //jobTitle, companyName, Location, jobType, description, postedby, comemail,
    const {
      jobTitle,
      companyName,
      location,
      description,
      descImgUrl,
      about,
      requirement,
      jobType,
      comEmail,
      facebookUrl,
      linkedInUrl,
      twitterUrl,
      webSiteUrl,
      postedDate,
      expDate,
      jobUrgency,
      category,
      subCategory,
    } = req.body;

    //Genarate Job Status
    if (new Date(postedDate) <= today && new Date(expDate) > today) {
      var calcStatus = "Active";
    } else if (new Date(postedDate) > today && new Date(expDate) > today) {
      var calcStatus = "Pending";
    } else if (new Date(postedDate) <= today && new Date(expDate) <= today) {
      var calcStatus = "Disabled";
    } else if (new Date(postedDate) >= today && new Date(expDate) <= today) {
      var calcStatus = "Disabled";
    }

    data = {
      jobTitle,
      companyName,
      location,
      jobStatus: calcStatus,
      description,
      descImgUrl,
      about,
      requirement,
      jobType,
      comEmail,
      facebookUrl,
      linkedInUrl,
      twitterUrl,
      webSiteUrl,
      postedDate,
      expDate,
      jobUrgency,
      category,
      subCategory,
      adminID: LogedAdmin._id,
    };

    await Job.create(data);

    return res
      .status(200)
      .send({ status: true, message: "Job created successful" });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//Delete existing job
const DeleteJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (job) {
    return res
      .status(200)
      .send({ status: true, message: "Job deleted successful" });
  } else {
    return res.status(404).send({
      success: false,
      message: "Job not found",
    });
  }
};

//Get all Active Job from database
const GetAllActiveJobs = async (req, res) => {
  try {
    //Get today date using specified timeZone
    let Lanka_str = new Date().toLocaleString("en-US", {
      timeZone: process.env.timeZone,
    });

    //Convert date string to Date format
    var date = new Date(Lanka_str);

    //Get all pendingJobs from database
    const pendingJobs = await Job.find({ jobStatus: "Pending" });

    //Check pending jobs are available in database
    if (pendingJobs.length > 0) {
      //Check postedDate <= current date and Update job status to Active
      for (var x = 0; x < pendingJobs.length; x++) {
        if (pendingJobs[x].postedDate <= date) {
          await Job.findByIdAndUpdate(pendingJobs[x]._id, {
            jobStatus: "Active",
          });
        }
      }
    }

    //Get all Active jobs from database
    const activeJobs = await Job.find({ jobStatus: "Active" });

    //Check active jobs are available in database
    if (activeJobs.length > 0) {
      //Check expDate <= current date and Update job status to Disabled
      for (var x = 0; x < activeJobs.length; x++) {
        if (activeJobs[x].expDate <= date) {
          await Job.findByIdAndUpdate(activeJobs[x]._id, {
            jobStatus: "Disabled",
          });
        }
      }
    }

    //Get All Active Jobs from database
    const ActiveJobs = await Job.find({ jobStatus: "Active" }).sort({
      createdAt: -1,
    });

    return res.status(200).send({ status: true, allActiveJobs: ActiveJobs });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//Get all jobs from the database (Active, Disabled, Pending)
const GetAllJobs = async (req, res) => {
  try {
    const AllJobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).send({ status: true, allJobs: AllJobs });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//Update Job details
const UpdateJob = async (req, res) => {
  try {
    //Get today date using specified timeZone
    let Lanka_str = new Date().toLocaleString("en-US", {
      timeZone: process.env.timeZone,
    });

    //Convert date string to Date format
    var today = new Date(Lanka_str);

    const jobId = req.params.id;
    const {
      jobTitle,
      companyName,
      location,
      description,
      descImgUrl,
      about,
      requirement,
      jobType,
      comEmail,
      facebookUrl,
      linkedInUrl,
      twitterUrl,
      webSiteUrl,
      postedDate,
      expDate,
      jobUrgency,
      category,
      subCategory,
    } = req.body;

    //Genarate Job Status
    if (new Date(postedDate) <= today && new Date(expDate) > today) {
      var calcStatus = "Active";
    } else if (new Date(postedDate) > today && new Date(expDate) > today) {
      var calcStatus = "Pending";
    } else if (new Date(postedDate) <= today && new Date(expDate) <= today) {
      var calcStatus = "Disabled";
    } else if (new Date(postedDate) >= today && new Date(expDate) <= today) {
      var calcStatus = "Disabled";
    }

    const jobCheck = await Job.findById(jobId);

    if (jobCheck) {
      await Job.findByIdAndUpdate(jobId, {
        jobTitle,
        companyName,
        location,
        jobStatus: calcStatus,
        description,
        descImgUrl,
        about,
        requirement,
        jobType,
        comEmail,
        facebookUrl,
        linkedInUrl,
        twitterUrl,
        webSiteUrl,
        postedDate,
        expDate,
        jobUrgency,
        category,
        subCategory,
      });

      return res
        .status(200)
        .send({ status: true, message: "Job updated successfully" });
    } else {
      return res.status(404).send({ status: false, message: "Job not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//Filter Job category
const filterJobs = async (req, res) => {
  try {
    const category = req.params.category;

    if (category === "IT") {
      const jobs = await Job.find({ jobType: "IT" });
      return res.status(200).send({ status: true, jobs: jobs });
    } else if (category === "Law") {
      const jobs = await Job.find({ jobType: "Law" });
      return res.status(200).send({ status: true, jobs: jobs });
    } else if (category === "Financial") {
      const jobs = await Job.find({ jobType: "Financial" });
      return res.status(200).send({ status: true, jobs: jobs });
    } else {
      return res.status(500).send({
        message: "Invalid Job Type",
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

const GetSpecificJob = async (req, res) => {
  try {
    const jobID = req.params.id;

    const jobCheck = await Job.findById(jobID);
    if (jobCheck) {
      return res.status(200).send({ status: true, job: jobCheck });
    } else {
      return res.status(200).send({ status: true, message: "Invalid job ID" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

module.exports = {
  CreateNewJob,
  DeleteJob,
  GetAllActiveJobs,
  GetAllJobs,
  UpdateJob,
  GetSpecificJob,
  filterJobs,
};
