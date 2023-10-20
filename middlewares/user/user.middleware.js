const helperUtil = require("../../utils/helper.util");
// const userAuth = async (req, res, next) => {
//   try {
//     const usedtoken = req.header("Authorization");
//     try {
//       var token = usedtoken.split(" ")[1];
//     } catch (e) {
//       return res
//         .status(401)
//         .send({ status: false, message: "User Login Required" });
//     }
//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     const logedUser = await User.findOne({
//       _id: decode._id,
//       "tokens.token": "Bearer" + " " + token,
//     });
//     if (!logedUser) {
//       return res
//         .status(401)
//         .send({ status: false, message: "Please Authenticate" });
//     }
//     req.token = "Bearer" + " " + token;
//     req.logedUser = logedUser;
//     next();
//   } catch (error) {
//     res.status(401).send({ message: error.message });
//   }
// };

const userAuth = (req, res, next) => {
  // const authHeader = req.header("Authorization");
  const authHeader = req.cookies.recruitment;

  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ status: false, message: "Authentication invalid" });
  }

  const token = helperUtil.extractToken(authHeader);

  if (token) {
    var payload = null;

    try {
      payload = helperUtil.verifyToken(token);

      if (payload.role != "User") {
        return res.status(401).json({
          status: false,
          message: "You're unauthorized to access this resource!",
        });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ status: false, message: "Your session is expired!" });
      } else {
        return res.status(401).json({
          status: false,
          message: "You're unauthorized to access this resource!",
        });
      }
    }

    req.logedUser = payload;

    return next();
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Authentication invalid" });
  }
};

module.exports = userAuth;
