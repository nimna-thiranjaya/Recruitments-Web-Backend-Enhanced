const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var sanitize = require("mongo-sanitize");
const clean = require("xss-clean/lib/xss").clean;
const User = require("../../models/user/user.model");
const { SendEmail } = require("../../utils/emailConnection");
const userEmail = require("./emails/userEmails");
const BadRequestError = require("../../error/error.classes/BadRequestError");
const helperUtil = require("../../utils/helper.util");

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
  const body = req.body;
  const newUser = new User(body);

  const emailCheck = await User.findOne({ email: body.email });
  if (!emailCheck) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));

    const hashedPassword = await bcrypt.hash(body.password, salt);

    newUser.password = hashedPassword;
    newUser.fullName = newUser.firstName + " " + newUser.lastName;
    newUser.role = "User";

    try {
      await newUser.save();
    } catch (e) {
      throw e;
    }

    const confirmUrl = await CreateConfirmationLink(newUser.email);

    let mailDetails = {
      from: process.env.EMAIL_USERNAME,
      to: newUser.email,
      subject: "Account Confirmation",
      html: userEmail.AccountConfirmationEmail(newUser.firstName, confirmUrl),
    };

    SendEmail(mailDetails);

    return res.status(201).send({
      success: true,
      email: newUser.email,
      message:
        "User Account Creation Successful, Account verification link send",
    });
  } else {
    throw new BadRequestError("Email Already Exists");
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
            html: userEmail.AccountConfirmationEmail(
              user.firstName,
              confirmUrl
            ),
          };

          SendEmail(mailDetails);

          return res.status(401).send({
            isVerified: user.verified,
            email: user.email,
            message: "please confirm your email",
          });
        } else {
          const token = helperUtil.createToken(user);
          // "Bearer" +
          //   " " +
          //   jwt.sign(
          //     { _id: user._id, role: user.role },
          //     process.env.JWT_SECRET,
          //     {
          //       expiresIn: "2d",
          //     }
          //   );

          res.cookie("recruitment", token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
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

    const user = await User.findById(LogedUser._id);

    const result = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      imageUrl: user.imageUrl,
      cv: user.cv,
      phoneNo: user.phoneNo,
      heading: user.heading,
      dob: user.dob,
      address: user.address,
      description: user.description,
      fburl: user.fburl,
      instaurl: user.instaurl,
      lnkdinurl: user.lnkdinurl,
      pturl: user.pturl,
      tturl: user.tturl,
      verified: user.verified,
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
    const userId = req.logedUser._id;

    const user = await User.findById(userId);

    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();

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
    const userId = req.logedUser._id;

    const user = await User.findById(userId);
    user.tokens = [];
    await user.save();

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
    console.log(clean(req.params));
    console.log(sanitize(req.params));

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
  DeleteUserAccount,
  UserEmailConfirmation,
  CheckUserEmailToForgotPassword,
  UserPasswordForgot,
  UserResetPasswordEmailCheck,
  UserResetPassword,
};
