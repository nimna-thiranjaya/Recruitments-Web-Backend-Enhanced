const mongoose = require("mongoose");

const connection = () => {
  const dbConStr = process.env.MONGODB_URL;
  mongoose.connect(dbConStr, () => {
    console.log("Database connected");
  });
};

module.exports = { connection };
