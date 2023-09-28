const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admin.model");
const { SendEmail } = require("../../utils/emailConnection");

//Fuction for Genarate Confirmation URL
const CreateConfirmationLink = async (email) => {
  const admin = await Admin.findOne({ email: email });

  const newToken = jwt.sign(
    { _id: admin._id },
    process.env.JWT_SECRET_EMAIL_CONFIRMATION,
    {
      expiresIn: "600s",
    }
  );

  return `https://rwa-webapp.azurewebsites.net/api/admin/EmailConfirm/${newToken}`;
};

//Admin Account Creation
const AdminRegistration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      imageUrl,
      profileImagePath,
    } = req.body;

    const emailCheck = await Admin.findOne({ email: email });
    if (!emailCheck) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = await Admin.create({
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        email,
        phoneNo,
        password: hashedPassword,
        imageUrl,
        role: "Admin",
        profileImagePath,
      });

      let mailDetails = {
        from: process.env.EMAIL_USERNAME,
        to: newAdmin.email,
        subject: "Tempory Credentials for Admin Signin",
        html: `<div
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
           Hey ${
             firstName + " " + lastName
           }! <br/> Welcome to Recruitement Website as an Admin
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
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657950148/Account-bro_bpoo94.png"
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
                Sign in to admin dashboard using tempory Crediantials.
              </h2>
              <div
              style="
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
              border-radius: 10px;
              ">
                <div style="padding: 5px 5px 5px 15px;">
                    <ul style="list-style-type:none;">
                        <li>Email - <b>${email}</b></li>
                        <li>Tempory Password - <b>${password}</b></li>
                    </ul>
                </div>
              </div>
    
              <a href="https://recruiters-admin.netlify.app/login" target="_blank">
                <button
                  style="
                    width: 100%;
                    padding: 8px;
                    border-radius: 30px;
                    border: 0;
                    background: #1A97F5;
                    color: #fff;
                    margin-top: 20px;
                  "
                >
                  Admin Sign in 
                </button>
              </a>
              
              <div style=" margin-top: 20px;">
                <p style="color: red; font-size: 10px;"><b>Disclaimer - </b>The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</p>
    
              </div>
            </div>
          </div>
      
      </div>`,
      };

      SendEmail(mailDetails);

      return res.status(200).send({
        success: true,
        email: newAdmin.email,
        message: "Admin Account Creation Successful, Check Your Email",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Email Already Exist",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

//Admin Login
const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Invalid Email Address",
      });
    } else {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        if (!admin.verified) {
          const confirmUrl = await CreateConfirmationLink(email);

          let mailDetails = {
            from: process.env.EMAIL_USERNAME,
            to: admin.email,
            subject: "Admin Account Confirmation",
            html: `
                <div
                  style="font-family: Roboto; background: white; overflow: hidden; margin-top:-100px"
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
                     Hey ${admin.fullName}! <br/> Welcome to Recruitement Website
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
                        style="width: 100%;
                        display: flex;
                        justify-content: center;"
                        src="https://res.cloudinary.com/dx1pvvqg7/image/upload/v1662727671/Confirmed-cuate_mvbd6b.png"
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
                          Please click on the link below to activate your account.
                        </h2>
                        <a href=${confirmUrl} target="_blank">
                          <button
                            style="
                              width: 100%;
                              padding: 8px;
                              border-radius: 30px;
                              border: 0;
                              background: #1A97F5;
                              color: #fff;
                              margin-top: 20px;
                            "
                          >
                            Activate Account
                          </button>
                        </a>
                        <div style=" margin-top: 20px">
                        <p style="color: red; font-size: 10px">
                          <b>Disclaimer - </b>The content of this email is confidential and
                          intended for the recipient specified in message only. It is strictly
                          forbidden to share any part of this message with any third party,
                          without a written consent of the sender. If you received this
                          message by mistake, please reply to this message and follow with its
                          deletion, so that we can ensure such a mistake does not occur in the
                          future.
                        </p>
                      </div>
                      </div>
                    </div>
                  </center>
                </div>
            `,
          };

          SendEmail(mailDetails);

          return res.status(401).send({
            success: false,
            isVerified: admin.verified,
            email: admin.email,
            message: "Please confirm your email Address",
          });
        } else {
          const token =
            "Bearer" +
            " " +
            jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
              expiresIn: "2d",
            });

          let oldTokens = admin.tokens || [];

          if (oldTokens.length) {
            oldTokens = oldTokens.filter((t) => {
              const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
              if (timeDiff < 86400 * 2) {
                return t;
              }
            });
          }

          await Admin.findByIdAndUpdate(admin._id, {
            tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
          });

          return res.status(200).send({
            isVerified: admin.verified,
            token: token,
            role: admin.role,
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid Password",
        });
      }
    }
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

//Get Admin PRofile details
const GetAdminProfile = async (req, res) => {
  try {
    const LogedAdmin = req.logedAdmin;

    const result = {
      _id: LogedAdmin._id,
      firstName: LogedAdmin.firstName,
      lastName: LogedAdmin.lastName,
      fullName: LogedAdmin.fullName,
      email: LogedAdmin.email,
      phoneNo: LogedAdmin.phoneNo,
      verified: LogedAdmin.verified,
      imageUrl: LogedAdmin.imageUrl,
      profileImagePath: LogedAdmin.profileImagePath,
      createdAt: LogedAdmin.createdAt,
      updatedAt: LogedAdmin.updatedAt,
    };

    res.status(200);
    res.send({ success: true, logedAdmin: result });
  } catch (error) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Log out All devices
const AdminLogOutFromAllDevices = async (req, res) => {
  try {
    req.logedAdmin.tokens = [];
    await req.logedAdmin.save();

    return res.status(200).send({
      success: true,
      message: "Admin Logout Successful",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Log Out
const AdminLogOut = async (req, res) => {
  try {
    req.logedAdmin.tokens = req.logedAdmin.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.logedAdmin.save();

    return res.status(200).send({
      success: true,
      message: "Admin Logout Successful",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Update Admin Profile
const UpdateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNo, imageUrl, profileImagePath } =
      req.body;

    const updatedUSer = await Admin.findByIdAndUpdate(req.logedAdmin._id, {
      firstName,
      lastName,
      fullName: firstName + " " + lastName,
      phoneNo,
      imageUrl,
      profileImagePath,
    });

    return res.status(200).send({
      success: true,
      message: "Admin Account Updated",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Delete Admin Profile
const DeleteAdminAccount = async (req, res) => {
  try {
    const userCheck = await Admin.findById(req.logedAdmin._id);

    if (!userCheck) {
      return res.status(400).send({
        success: false,
        message: "There is no Admin to delete",
      });
    } else {
      const deletedAccount = await Admin.findByIdAndDelete(req.logedAdmin._id);
      res
        .status(200)
        .send({ status: true, message: "Admin Acoount Delete Successful" });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Email Confirmation
const EmailConfirmation = async (req, res) => {
  try {
    const linkJwt = req.params.jwt;

    try {
      var decode = jwt.verify(
        linkJwt,
        process.env.JWT_SECRET_EMAIL_CONFIRMATION
      );
    } catch (e) {
      return res.status(401).send({ status: false, error: "Link Expired" });
    }

    const admin = await Admin.findById(decode._id);
    if (admin) {
      await Admin.findByIdAndUpdate(decode._id, { verified: true });
      return res.redirect("https://recruiters-admin.netlify.app/login");
    } else {
      return res.status(400).send({
        success: false,
        message: "There is no admin account",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//genarate and send forgot password link
const CheckEmailToForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email: email });
    if (admin) {
      const Link = jwt.sign(
        { _id: admin._id },
        process.env.JWT_SECRET_PASSWORD_REST,
        {
          expiresIn: "600s",
        }
      );

      const passwordRestUrl = `https://recruiters-admin.netlify.app/resetpw/${Link}`;

      let mailDetails = {
        from: process.env.EMAIL_USERNAME,
        to: admin.email,
        subject: "Forgot Password",
        html: `  <div
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
            Hi ${admin.fullName}! Forgot Your Password ?
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
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1658040973/Forgot_password-cuate_1_rpyxak.png"
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
              Trouble signing in?
              Resetting your password is easy.
              
              Just press the button below and follow the instructions. We’ll have you up and running in no time.
              </h2>
    
              <a href=${passwordRestUrl} target="_blank">
                <button
                  style="
                    width: 100%;
                    padding: 8px;
                    border-radius: 30px;
                    border: 0;
                    background: #1A97F5;
                    color: #fff;
                    margin-top: 20px;
                  "
                >
                  Reset Password 
                </button>
              </a>
              
              <div style=" margin-top: 20px;">
                <p style="color: red; font-size: 10px;"><b>Disclaimer - </b>The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</p>
    
              </div>
            </div>
          </div>
      </div>`,
      };

      SendEmail(mailDetails);

      return res.status(200).send({
        status: true,
        message: "Password reset link send to your mail",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid Email Address, Account Not Found",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Reset password using forgot password link
const PasswordForgot = async (req, res) => {
  try {
    const ResetLink = req.params.Link;
    const { password } = req.body;

    try {
      var decode = jwt.verify(ResetLink, process.env.JWT_SECRET_PASSWORD_REST);
    } catch (e) {
      return res
        .status(401)
        .send({ status: false, message: "Link Expired or Invalid Link" });
    }

    const admin = await Admin.findById(decode._id);

    if (admin) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

      const hashedPassword = await bcrypt.hash(password, salt);

      await Admin.findByIdAndUpdate(decode._id, {
        password: hashedPassword,
        tokens: [],
      });

      return res.status(200).send({
        success: true,
        message: "Password Updated",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Check link and Password Reset
const ResetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const LogedAdmin = req.logedAdmin;

    isOldPassMatch = await bcrypt.compare(oldPassword, LogedAdmin.password);

    if (isOldPassMatch) {
      if (!(oldPassword === newPassword)) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Admin.findByIdAndUpdate(LogedAdmin._id, {
          password: hashedPassword,
          tokens: [],
        });

        return res
          .status(200)
          .send({ status: true, message: "password changed" });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "old and new passwords are same" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Old Password not match" });
    }
  } catch (e) {
    return res.status(500).send({ status: false, message: e.message });
  }
};

module.exports = {
  AdminRegistration,
  AdminLogin,
  GetAdminProfile,
  AdminLogOut,
  UpdateAdminProfile,
  AdminLogOutFromAllDevices,
  DeleteAdminAccount,
  EmailConfirmation,
  PasswordForgot,
  CheckEmailToForgotPassword,
  ResetPassword,
};
