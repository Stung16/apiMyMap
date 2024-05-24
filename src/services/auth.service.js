const { User, KeyToken } = require("../../src/models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passport = require("passport");
const { ServerResponse } = require("http");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const { object, string, number } = require("yup");
const sendMail = require("../utils/mail");
const generateRandomPassword = require("../utils/createPass");

module.exports = {
  handleLoginWithGoogle: async (req) => {
    const response = {};
    try {
      const emptyResponse = new ServerResponse(req);
      passport.authenticate(
        "google",
        {
          scope: ["email", "profile"],
        },
        (err, user, info) => {
          console.log(err, user, info);
        }
      )(req, emptyResponse);

      const url = emptyResponse.getHeader("location");
      Object.assign(response, {
        result: {
          urlRedirect: url,
        },
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "bad request",
        error: 1,
      });
    }
    return response;
  },
  handleLoginWithGoogleCallback: async (req) => {
    const response = {};
    try {
      const data = req.user;
      console.log(data);
      if (!data) {
        return Object.assign(response, {
          status: 400,
          message: "Bad request",
          error: 1,
        });
      }
      let user = await User.findOne({
        where: { email: data.email, provider: "google" },
      });
      if (!user) {
        const newUser = await User.create({
          id: crypto.randomBytes(4).toString("hex"),
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          provider: "google",
        });
        user = newUser;
      }
      //   const privateKey = crypto.randomBytes(64).toString("hex");
      //   const publicKey = crypto.randomBytes(64).toString("hex");
      const { JWT_SECRET, JWT_EXPIRE, JWT_REFRESH } = process.env;
      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });
      const refreshToken = jwt.sign(
        { data: new Date().getTime() + Math.random() },
        JWT_SECRET,
        {
          expiresIn: JWT_REFRESH,
        }
      );
      await KeyToken.findOrCreate({
        where: { refresh_token: refreshToken },
        defaults: {
          user_id: user.id,
          refresh_token: refreshToken,
        },
      });
      Object.assign(response, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        error: 0,
      });
    } catch (error) {
      console.log(error);
      Object.assign(response, {
        status: 400,
        message: "bad request",
        error: 1,
      });
    }
    return response;
  },
  handleForgotPass: async (body) => {
    const response = {};
    const schema = object({
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
    });
    try {
      const result = await schema.validate(body, {
        abortEarly: false,
      });
      const user = await User.findOne({
        where: { email: result.email, provider: null },
      });
      if (!user) {
        return Object.assign(response, {
          status: 400,
          message: "tài khoản không tồn tại!!!",
          error: 1,
        });
      }
      const newPass = generateRandomPassword();
      sendMail(result.email, "Xác minh tài khoản", newPass);
      const passwordHash = await bcrypt.hash(newPass, 10);
      if (!passwordHash) {
        return Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: 1,
        });
      }
      await User.update(
        {
          password: passwordHash,
        },
        { where: { id: user.id } }
      );
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (e) {
      console.log(e);
      const errors = Object?.fromEntries(
        e?.inner?.map((item) => [item?.path, item?.message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        errors,
        error: 1,
      });
    }
    return response;
  },
};
