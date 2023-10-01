const express = require("express");
const passport = require("passport");
const helperUtil = require("../../utils/helper.util");
const AuthRouter = express.Router();

AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = helperUtil.createToken(req.user);
    res.cookie("recruitment", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
    }); // Store JWT in a cookie
    res.redirect("http://localhost:3000/Home");
  }
);

AuthRouter.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("recruitment");
  res.redirect("http://localhost:3000/");
});

AuthRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

AuthRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    const token = helperUtil.createToken(req.user);
    res.cookie("recruitment", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
    });
    res.redirect("http://localhost:3000/Home");
  }
);

module.exports = AuthRouter;
