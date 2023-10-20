const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("express-async-errors");
const dotenv = require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { connection } = require("./utils/dbConnection");
const RequestMapping = require("./mapping");

require("./utils/auth.config");

const errorHandlerMiddleware = require("./error/error.middleware");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Sanitize data
app.use(
  mongoSanitize({
    replaceWith: "_",
    allowDots: true,
  })
);

//Prevent XSS attacks
app.use(xss());

// Use Helmet!
app.use(helmet());

//Apply rate limiter to all requests
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 mins
  max: 100, //100 requests
  message: "Too many requests from this IP, please try again in an hour!",
});

//Rate limiting
app.use(limiter);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Request mappings
RequestMapping(app);

//Error handling middleware
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

app.get("/test-cookie", (req, res) => {
  const recruitmentCookie = req.cookies.recruitment;
  res.send(`Value of 'recruitment' cookie: ${recruitmentCookie}`);
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
  connection();
});
