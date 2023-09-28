const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.model");
const { SendEmail } = require("../../utils/emailConnection");

//Fuction for Genarate Confirmation URL
const CreateConfirmationLink = async (email) => {
  const user = await User.findOne({ email: email });

  const newToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_EMAIL_CONFIRMATION,
    {
      expiresIn: "600s",
    }
  );

  return `https://rwa-webapp.azurewebsites.net/api/user/UserEmailConfirm/${newToken}`;
};

//Email Confirmation
const UserEmailConfirmation = async (req, res) => {
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

    const user = await User.findById(decode._id);
    if (user) {
      await User.findByIdAndUpdate(decode._id, { verified: true });
      res.redirect("https://recruiters-web.netlify.app/Login");
    } else {
      return res.status(400).send({
        success: false,
        message: "There is no User Account",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//User Account Creation
const UserRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    const emailCheck = await User.findOne({ email: email });
    if (!emailCheck) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        email,
        phoneNo,
        password: hashedPassword,
        role: "User",
      });

      const confirmUrl = await CreateConfirmationLink(newUser.email);

      let mailDetails = {
        from: process.env.EMAIL_USERNAME,
        to: newUser.email,
        subject: "Account Confirmation",
        html: ` <div
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
           Hey ${newUser.firstName}! <br/> Welcome to Recruitement Website
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
              src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657722063/Sign_up-bro_rjte42.png"
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
              <a href=${confirmUrl}>
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
                  Activate Account
                </button>
              </a>
            </div>
          </div>
        </center>
      </div>`,
      };

      SendEmail(mailDetails);

      return res.status(201).send({
        success: true,
        email: newUser.email,
        message:
          "User Account Creation Successful, Account verification link send",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Email Already Exists",
      });
    }
  } catch (e) {
    return res.status(500).send({ success: false, error: e.message });
  }
};

//User Login
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Threre is no user account, Invalid email",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (!user.verified) {
          const confirmUrl = await CreateConfirmationLink(email);

          let mailDetails = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: "Account Confirmation",
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
                       Hey ${user.firstName}! <br/> Welcome to Recruitement Website
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
                          src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657722063/Sign_up-bro_rjte42.png"
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
                          <a href=${confirmUrl}>
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
                              Activate Account
                            </button>
                          </a>
                        </div>
                      </div>
                    </center>
                  </div>
              `,
          };

          SendEmail(mailDetails);

          return res.status(401).send({
            isVerified: user.verified,
            email: user.email,
            message: "please confirm your email",
          });
        } else {
          const token =
            "Bearer" +
            " " +
            jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "2d",
            });

          let oldTokens = user.tokens || [];

          if (oldTokens.length) {
            oldTokens = oldTokens.filter((t) => {
              const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
              if (timeDiff < 86400 * 2) {
                return t;
              }
            });
          }

          await User.findByIdAndUpdate(user._id, {
            tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
          });

          return res.status(200).send({
            isVerified: user.verified,
            token: token,
            role: user.role,
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

//Get User Profile details
const GetUserProfile = async (req, res) => {
  try {
    const LogedUser = req.logedUser;

    const result = {
      _id: LogedUser._id,
      firstName: LogedUser.firstName,
      lastName: LogedUser.lastName,
      fullName: LogedUser.fullName,
      email: LogedUser.email,
      imageUrl: LogedUser.imageUrl,
      cv: LogedUser.cv,
      phoneNo: LogedUser.phoneNo,
      heading: LogedUser.heading,

      dob: LogedUser.dob,
      address: LogedUser.address,
      description: LogedUser.description,
      fburl: LogedUser.fburl,
      instaurl: LogedUser.instaurl,
      lnkdinurl: LogedUser.lnkdinurl,
      pturl: LogedUser.pturl,
      tturl: LogedUser.tturl,

      verified: LogedUser.verified,
    };

    res.status(200);
    res.send({ success: true, logedUser: result });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Log Out
const UserLogOut = async (req, res) => {
  try {
    req.logedUser.tokens = req.logedUser.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.logedUser.save();

    return res.status(200).send({
      success: true,
      message: "User Logout Successful",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Log out All devices
const UserLogOutFromAllDevices = async (req, res) => {
  try {
    req.logedUser.tokens = [];
    await req.logedUser.save();

    return res.status(200).send({
      success: true,
      message: "User Logout Successful",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Update User Profile
const UpdateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNo,
      dob,
      address,
      description,
      heading,
      fburl,
      instaurl,
      lnkdinurl,
      pturl,
      tturl,
      cv,
      imageUrl,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.logedUser._id, {
      firstName,
      lastName,
      fullName: firstName + " " + lastName,
      phoneNo,
      dob,
      address,
      description,
      heading,
      fburl,
      instaurl,
      lnkdinurl,
      pturl,
      tturl,
      cv,
      imageUrl,
    });

    return res.status(200).send({
      success: true,
      message: "User Account Updated",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

// //Upload Profile image
// const UploadImg = async (req, res) => {
//   try {
//     const { imageUrl } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(req.logedUser._id, {
//       imageUrl,
//       lastUpdatedDate: GetNowDateAndTime(),
//     });

//     return res.status(200).send({
//       success: true,
//       message: "User Profile Image Uploaded Successfully",
//     });
//   } catch (e) {
//     res.status(500);
//     res.send({ status: false, error: e.message });
//   }
// };

// //Upload CV to profile
// const UploadCV = async (req, res) => {
//     try {
//       const { cv } = req.body;

//       const updatedUser = await User.findByIdAndUpdate(req.logedUser._id, {
//         cv,
//         lastUpdatedDate: GetNowDateAndTime(),
//       });

//       return res.status(200).send({
//         success: true,
//         message: "User Profile Image Uploaded Successfully",
//       });
//     } catch (e) {
//       res.status(500);
//       res.send({ status: false, error: e.message });
//     }
//   };

//genarate and send forgot password link
const CheckUserEmailToForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      const Link = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET_PASSWORD_REST,
        {
          expiresIn: "600s",
        }
      );

      const passwordRestUrl = `https://rwa-webapp.azurewebsites.net/api/user/UserForgotPassword/${Link}`;

      return res.status(200).send({
        status: true,
        passResetUrl: passwordRestUrl,
        message: "Password reset link send to your mail",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid Email Address",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Reset password using forgot password link
const UserPasswordForgot = async (req, res) => {
  try {
    const ResetLink = req.params.Link;
    const { password } = req.body;

    try {
      var decode = jwt.verify(ResetLink, process.env.JWT_SECRET_PASSWORD_REST);
    } catch (e) {
      return res
        .status(401)
        .send({ status: false, error: "Link Expired or Invalid Link" });
    }

    const user = await User.findById(decode._id);

    if (user) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

      const hashedPassword = await bcrypt.hash(password, salt);

      await User.findByIdAndUpdate(decode._id, {
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

//Genarate and send RESET password Link
const UserResetPasswordEmailCheck = async (req, res) => {
  try {
    const LogedUser = req.logedUser;

    const newToken = jwt.sign(
      { _id: LogedUser._id },
      process.env.JWT_SECRET_EMAIL_CONFIRMATION,
      {
        expiresIn: "600s",
      }
    );

    ResetPasswrodUrl = `https://rwa-webapp.azurewebsites.net/api/user/UserResetPassword/${newToken}`;

    res.status(200);
    res.send({
      success: true,
      url: ResetPasswrodUrl,
      message: "Password reset link send",
    });
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Check link and Password Reset
const UserResetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const LogedUser = req.logedUser;

    if (!LogedUser) {
      return res.status(400).send({
        success: false,
        message: "Please Authenticate",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, LogedUser.password);

    if (isMatch) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(LogedUser._id, {
        password: hashedPassword,
        tokens: [],
      });

      return res.status(200).send({
        success: true,
        message: "Password Reset Successful",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Old Password is Invalid",
      });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

//Delete User Profile
const DeleteUserAccount = async (req, res) => {
  try {
    const userCheck = await User.findById(req.logedUser._id);

    if (!userCheck) {
      return res.status(400).send({
        success: false,
        message: "Threre is no user to delete",
      });
    } else {
      const deletedAccount = await User.findByIdAndDelete(req.logedUser._id);
      res
        .status(200)
        .send({ status: true, message: "User Acoount Deleted Successful" });
    }
  } catch (e) {
    res.status(500);
    res.send({ status: false, error: e.message });
  }
};

module.exports = {
  UserRegistration,
  UserLogin,
  GetUserProfile,
  UserLogOut,
  UserLogOutFromAllDevices,
  UpdateUser,
  //UploadImg,
  //UploadCV,
  DeleteUserAccount,
  UserEmailConfirmation,
  CheckUserEmailToForgotPassword,
  UserPasswordForgot,
  UserResetPasswordEmailCheck,
  UserResetPassword,
};
