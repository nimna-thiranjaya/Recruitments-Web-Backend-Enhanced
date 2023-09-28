const express = require("express");
const AdminRouter = express.Router();
const adminAuth = require("../../middlewares/admin/admin.middleware");

const {
  AdminRegistration,
  AdminLogin,
  GetAdminProfile,
  AdminLogOut,
  AdminLogOutFromAllDevices,
  UpdateAdminProfile,
  DeleteAdminAccount,
  EmailConfirmation,
  PasswordForgot,
  CheckEmailToForgotPassword,
  ResetPassword,
} = require("../../controllers/admin/admin.controller");

AdminRouter.post("/Register", AdminRegistration);
AdminRouter.post("/AdminLogin", AdminLogin);
AdminRouter.get("/AdminProfile", adminAuth, GetAdminProfile);
AdminRouter.post("/AdminLogout", adminAuth, AdminLogOut);
AdminRouter.post("/AdminLogoutAll", adminAuth, AdminLogOutFromAllDevices);
AdminRouter.patch("/UpdateAdmin", adminAuth, UpdateAdminProfile);
AdminRouter.delete("/DeleteAdmin", adminAuth, DeleteAdminAccount);
AdminRouter.get("/EmailConfirm/:jwt", EmailConfirmation);
AdminRouter.post("/EmailCheck", CheckEmailToForgotPassword);
AdminRouter.patch("/ForgotPassword/:Link", PasswordForgot);
AdminRouter.patch("/ResetPassword", adminAuth, ResetPassword);

module.exports = AdminRouter;
