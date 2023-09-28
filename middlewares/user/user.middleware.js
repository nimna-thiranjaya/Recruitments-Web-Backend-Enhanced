const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.model");

const userAuth = async (req, res, next) => {
  try {
    const usedtoken = req.header("Authorization");
    try {
      var token = usedtoken.split(" ")[1];
    } catch (e) {
      return res
        .status(401)
        .send({ status: false, message: "User Login Required" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const logedUser = await User.findOne({
      _id: decode._id,
      "tokens.token": "Bearer" + " " + token,
    });
    if (!logedUser) {
      return res
        .status(401)
        .send({ status: false, message: "Please Authenticate" });
    }
    req.token = "Bearer" + " " + token;
    req.logedUser = logedUser;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

module.exports = userAuth;
