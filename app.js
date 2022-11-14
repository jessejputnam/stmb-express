"use strict";

require("dotenv").config();

const createError = require("http-errors");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const passport = require("./middlewares/passport");

// Database Connection
//! UPDATE TO NON-TEST DATABSE AT PRODUCTION
// const mongoDB = process.env.MONGODB_URI;
const mongoDB = process.env.MONGODB_TEST_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routing
const indexRouter = require("./routes/index");
const webhookRouter = require("./routes/webhook");
const searchRouter = require("./routes/search");

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
  databaseName: "test-db"
});

sessionStore.on(
  "error",
  console.error.bind(console, "MongoDB Session Storage connection error")
);

// app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "js.stripe.com/v3/"],
      "frame-src": ["'self'", "js.stripe.com/v3/"]
    }
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));

// Use raw header for webhooks
app.use(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookRouter
);

// User json parsing for rest
app.use(express.json());

app.use(cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -------------- Passport Session ------------------ //
app.use(
  session({
    cookie: {
      maxAge: 60 * 60 * 1000,
      // httpOnly: true,
      // secure: true
      sameSite: true
    },
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    name: "session-id",
    resave: false,
    rolling: true,
    saveUninitialized: true
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// -------------- End Passport --------------------- //

// Get access to currentUser variable in all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.urlencoded({ extended: false }));

// ------------ Routes --------------- //
app.use("/search", searchRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
