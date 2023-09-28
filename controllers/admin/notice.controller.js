const Notice = require("../../models/admin/notice.model");

//create notice-------------------------------------
const CreateNotices = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrlPoster,
      imageUrlIcon,
      postedDate,
      expDate,
    } = req.body;

    //Get today date using specified timeZone
    let Lanka_str = new Date().toLocaleString("en-US", {
      timeZone: process.env.timeZone,
    });

    //Convert date string to Date format
    var today = new Date(Lanka_str);

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
      title,
      description,
      imageUrlPoster,
      imageUrlIcon,
      postedDate,
      expDate,
      noticeStatus: calcStatus,
    };

    await Notice.create(data);
    return res
      .status(200)
      .send({ status: true, message: "Notice created successfully :)" });
  } catch (err) {
    return res.status(500).send({ success: false, message: err });
  }
};


//Get All Notices--------------------------------------

const GetAllNotices = async (req, res) => {
  try {
    const AllNotices = await Notice.find().sort({ createdAt: -1 });

    return res.status(200).send({ status: true, allnotices: AllNotices });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};


//Delete Specific Post----------------------------------
const DeleteNotice = async (req, res) => {
  try {
    const NoticeId = req.params.id;
    const checkNotice = await Notice.findById(NoticeId);

    if (checkNotice) {
      await Notice.findByIdAndDelete(NoticeId);

      return res
        .status(200)
        .send({ status: true, message: "Notice Deleted successfully :)" });
    } else {
      return res
        .status(404)
        .send({ status: false, message: " Notice Not Found!!!" });
    }
  } catch (err) {
    return res.status(500).send({ success: false, message: err });
  }
};

//Get Specific notice detailes--------------------------------------
const GEtSpecificNotice = async (req, res) => {
  try {
    const NoticeId = req.params.id;
    const specialNotice = await Notice.findById(NoticeId);

    return res.status(200).send({ status: true, notice: specialNotice });
  } catch (err) {
    return res.status(500).send({ success: false, message: err });
  }
};

//Update Specific Notice-----------------------------------

const UpdateNotice = async (req, res) => {
  try {
    const NoticeId = req.params.id;
    const {
      title,
      description,
      imageUrlPoster,
      imageUrlIcon,
      postedDate,
      expDate,
    } = req.body;

    const checkNotice = await Notice.findById(NoticeId);

    if (checkNotice) {
      //Get today date using specified timeZone
      let Lanka_str = new Date().toLocaleString("en-US", {
        timeZone: process.env.timeZone,
      });

      //Convert date string to Date format
      var today = new Date(Lanka_str);

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
      noticeNewData = {
        title: title,
        description: description,
        imageUrlPoster: imageUrlPoster,
        imageUrlIcon: imageUrlIcon,
        noticeStatus: calcStatus,
        postedDate: postedDate,
        expDate: expDate,
      };

      await Notice.findByIdAndUpdate(NoticeId, noticeNewData);

      return res
        .status(200)
        .send({ status: true, message: "Notice updated successfully" });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "Notice not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};


//Get All Active Notices--------------------------------------
const GetAllActiveNotices = async (req, res) => {
  try {
        //Get today date using specified timeZone
        let Lanka_str = new Date().toLocaleString("en-US", {
          timeZone: process.env.timeZone,
        });
    
        //Convert date string to Date format
        var date = new Date(Lanka_str);
    
        const pendingNotices = await Notice.find({ noticeStatus: "Pending" });
    
        if (pendingNotices.length > 0) {
          for (var x = 0; x < pendingNotices.length; x++) {
            if (pendingNotices[x].postedDate <= date) {
              await Notice.findByIdAndUpdate(pendingNotices[x]._id, {
                noticeStatus: "Active",
              });
            }
          }
        }
    //Get all Active notices from database
        const activeNotices = await Notice.find({ noticeStatus: "Active" });
    
        //Check active notices are available in database
        if (activeNotices.length > 0) {
          for (var x = 0; x < activeNotices.length; x++) {
            if (activeNotices[x].expDate <= date) {
              await Notice.findByIdAndUpdate(activeNotices[x]._id, {
                noticeStatus: "Disabled",
              });
            }
          }
        }
         //Get All Active Jobs from database
         const ActiveNotices = await Notice.find({ noticeStatus: "Active" }).sort({
          createdAt: -1,
        });
    
        return res.status(200).send({ status: true, allActivenotices: ActiveNotices });
      } catch (err) {
        return res.status(500).send({ success: false, message: err });
      }
};

module.exports = {
  CreateNotices,
  GetAllNotices,
  DeleteNotice,
  GEtSpecificNotice,
  UpdateNotice,
  GetAllActiveNotices,
};
