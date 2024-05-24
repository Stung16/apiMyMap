require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const session = require("express-session");
const morgan = require("morgan")
const passport = require("passport");
const GooglePassport = require("./passport/google.passport");
var cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();
app.use(cors());

app.use(morgan("dev")) // log lỗi trực quan hơn
app.use(helmet()) // bảo vệ thông tin dự án
app.use(compression()) // giảm dung lượng file được gửi đi
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use("google", GooglePassport);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});
app.use("/", indexRouter);

// catch 404 and forward to error handler


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
