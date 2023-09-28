const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
});

const SendEmail = (Data) => {
  mailTransporter.sendMail(Data, function (err, data) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = { SendEmail };
