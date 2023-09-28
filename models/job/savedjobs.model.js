const mongoose = require("mongoose");
const savedjobsSchema = new mongoose.Schema(
  {
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
      },

    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    jobDetails: {
      type: Object,
      
    },

  },
  {timestamps:true}
  
);

const savedjobs = mongoose.model("savedjobs", savedjobsSchema);
module.exports = savedjobs;
