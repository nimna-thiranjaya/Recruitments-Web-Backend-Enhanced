const express = require("express");
const UserRouter = express.Router();
const userAuth = require("../../middlewares/user/user.middleware");

const {
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
  UserResetPassword
} = require("../../controllers/user/user.controller");

UserRouter.post("/userRegister", UserRegistration);
UserRouter.get("/UserEmailConfirm/:jwt", UserEmailConfirmation);
UserRouter.post("/userLogin", UserLogin);
UserRouter.get("/userProfile",userAuth, GetUserProfile);
UserRouter.post("/userLogOut",userAuth, UserLogOut);
UserRouter.post("/userLogOutAll",userAuth, UserLogOutFromAllDevices);
UserRouter.patch("/userUpdateProfile",userAuth, UpdateUser);
//UserRouter.patch("/uploadProfileImage",userAuth, UploadImg);
//UserRouter.patch("/uploadCV",userAuth, UploadCV);
UserRouter.delete("/deleteUserProfile",userAuth, DeleteUserAccount);
UserRouter.post("/UserEmailCheck", CheckUserEmailToForgotPassword);
UserRouter.patch("/UserForgotPassword/:Link", UserPasswordForgot);
UserRouter.get("/ResetPasswordEmail", userAuth, UserResetPasswordEmailCheck);
UserRouter.patch("/UserResetPassword",userAuth, UserResetPassword);

module.exports = UserRouter;
