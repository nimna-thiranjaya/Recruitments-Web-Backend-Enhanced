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
    res.cookie("recruitment", token, { maxAge: 3600000 }); // Store JWT in a cookie
    res.redirect("http://localhost:3000/Home");
  }
);

module.exports = AuthRouter;
