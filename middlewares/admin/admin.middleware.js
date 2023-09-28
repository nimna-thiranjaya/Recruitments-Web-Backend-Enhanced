const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admin.model");

const adminAuth = async (req, res, next) => {
  try {
    const usedtoken = req.header("Authorization");
    try {
      var token = usedtoken.split(" ")[1];
    } catch (e) {
      return res
        .status(401)
        .send({ status: false, message: "Admin Login Required" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const logedAdmin = await Admin.findOne({
      _id: decode._id,
      "tokens.token": "Bearer" + " " + token,
    });
    if (!logedAdmin) {
      return res
        .status(401)
        .send({ status: false, message: "Please Authenticate" });
    }
    req.token = "Bearer" + " " + token;
    req.logedAdmin = logedAdmin;
    next();
  } catch (error) {
    return res.status(401).send({ status: false, message: error.message });
  }
};

module.exports = adminAuth;
