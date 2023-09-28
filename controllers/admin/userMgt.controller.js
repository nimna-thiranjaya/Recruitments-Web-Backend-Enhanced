const User = require("../../models/user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admin.model");
const { SendEmail } = require("../../utils/emailConnection");

const GetAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
      .select(
        "firstName lastName fullName email phoneNo imageUrl status verified createdAt"
      )
      .sort({ createdAt: -1 });

    if (allUsers) {
      return res.status(200).send({ status: true, allUsers: allUsers });
    } else {
      return res.status(400).send({
        success: false,
        message: "There Are No Any Users",
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

const GetSpecificUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (user) {
      return res.status(200).send({ status: true, user: user });
    } else {
      return res.status(401).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

const DeleteSpecificUser = async (req, res) => {
  try {
    const userId = req.params.id;

    userCheck = await User.findById(userId);

    if (userCheck) {
      await User.findByIdAndDelete(userId);

      return res
        .status(200)
        .send({ status: true, message: "User deleted successfully" });
    } else {
      return res.status(404).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

const UpdateSpecificUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNo, verified } = req.body;

    const user = await User.findById(userId);

    if (user) {
      userNewData = {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        phoneNo: phoneNo,
        verified: verified,
      };

      await User.findByIdAndUpdate(userId, userNewData);

      return res
        .status(200)
        .send({ status: true, message: "User updated successfully" });
    } else {
      return res.status(404).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

const SetTemporyPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { tempPassword } = req.body;

    const user = await User.findById(userId);

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    if (user) {
      userNewData = {
        password: hashedPassword,
        tokens: [],
      };

      await User.findByIdAndUpdate(userId, userNewData);

      let mailDetails = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: "Tempory password",
        html: `
        <div
        style="font-family: Roboto; background: white; overflow: hidden; margin-top:-0px"
      >
        <div
          style="
            position: relative;
            margin: 0px auto;
            width: 80%;
            max-width: 400px;
            padding: 20px;
            box-shadow: 3px 10px 20px rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            border: 0;
          "
        >
        
          <div>
            <div>
            <h2
              style="
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                letter-spacing: 0.6px;
                font-weight: 300;
              "
            >
           Hey ${user.fullName} ! <br/>
            </h2>
            </div>
          </div>
          <div
            style="
              margin-top: 25px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
            "
          >
            <img
              style="width: 80%;
              display: flex;
              justify-content: center;"
              src="https://res.cloudinary.com/dx1pvvqg7/image/upload/v1665766113/Forgot_password-bro_ox4oxy.png"
              alt=""
            />
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            "
          >
            <div>
              <h2
                style="
                  text-align: center;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 18px;
                  letter-spacing: 0.5px;
                  font-weight: 300;
                "
              >
                As you requested the admin has assigned a tempory password. Your tempory password is mention below.
              </h2>
              <div
              style="
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
              border-radius: 10px;
              ">
                <div style="padding: 5px 5px 5px 15px;">
                    <ul style="list-style-type:none;">
                        <li>Tempory Password - <b>${tempPassword}</b></li>
                    </ul>
                </div>
              </div>
    
              <a href="https://recruiters-web.netlify.app/Login" target="_blank">
                <button
                  style="
                    width: 100%;
                    padding: 8px;
                    border-radius: 30px;
                    border: 0;
                    background: #17bf9e;
                    color: #fff;
                    margin-top: 20px;
                  "
                >
                Sign in 
                </button>
              </a>
              
              <div style=" margin-top: 20px;">
                <p style="color: red; font-size: 10px;"><b>Disclaimer - </b>The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</p>
    
              </div>
            </div>
          </div>
      
      </div>
      </div>`,
      };

      SendEmail(mailDetails);

      return res
        .status(200)
        .send({ status: true, message: "Tempory password added !" });
    } else {
      return res.status(404).send({ status: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  GetAllUsers,
  GetSpecificUser,
  DeleteSpecificUser,
  UpdateSpecificUser,
  SetTemporyPassword,
};
