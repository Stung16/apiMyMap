const { object, string, number } = require("yup");
const { User, KeyToken, BlacklistToken } = require("../../src/models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = {
  handleLogin: async (body) => {
    const response = {};
    const schema = object({
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
      password: string()
        .required("Mật khẩu bắt buộc phải nhập")
        .min(8, "mật khẩu ít nhất 8 ký tự"),
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
          message: "tài khoản hoặc mật khẩu không đúng!!!",
          error: 1,
        });
      }
      const match = await bcrypt.compare(result.password, user.password);
      if (!match) {
        return Object.assign(response, {
          status: 400,
          message: "tài khoản hoặc mật khẩu không đúng!!!",
          error: 1,
        });
      }
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
      return Object.assign(response, {
        accessToken: accessToken,
        refreshToken: refreshToken,
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
  handleResgiter: async (body) => {
    const response = {};
    const schema = object({
      name: string().required("Email bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
      password: string()
        .required("Mật khẩu bắt buộc phải nhập")
        .min(8, "mật khẩu ít nhất 8 ký tự"),
    });
    try {
      const result = await schema.validate(body, {
        abortEarly: false,
      });
      const user = await User.findOne({
        where: { email: result.email },
      });
      if (user) {
        return Object.assign(response, {
          status: 400,
          message: "Tài khoản đã tồn tại!!!",
          error: 1,
        });
      } else {
        const passwordHash = await bcrypt.hash(result.password, 10);
        await User.create({
          id: crypto.randomBytes(4).toString("hex"),
          name: result.name,
          email: result.email,
          password: passwordHash,
          avatar:
            "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
          status: true,
        });
        Object.assign(response, {
          success: "đăng ký thành công",
          status: 201,
          error: 0,
        });
      }
    } catch (e) {
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
  handleCheckAuth: async ({ accessToken }) => {
    const response = {};
    try {
      const existToken = await BlacklistToken.findOne({ where: { token } });
      if (existToken) {
        return Object.assign(response, {
          status: 400,
          message: "Bad requrest",
          error: 1,
        });
      }
      const { JWT_SECRET } = process.env;
      const { userId } = jwt.verify(accessToken, JWT_SECRET);
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password", "refresh_token"] },
      });
      if (!user) {
        return Object.assign(response, {
          status: 404,
          message: "Người dùng không tồn tại",
          error: 1,
        });
      }
      Object.assign(response, {
        status: 200,
        user: user,
        message: "Success",
        error: 1,
      });
      req.user = {
        ...user,
        id: user?.id,
        accessToken: token,
        expired: new Date(exp * 1000),
      };
      return next();
    } catch {
      Object.assign(response, {
        status: 401,
        message: "Unauthorized",
      });
    }
    return response;
  },
  handleLogOut: async ({ accessToken, expired }) => {
    const response = {};
    try {
      await BlacklistToken.findOrCreate({
        where: { token: accessToken },
        defaults: {
          token: accessToken,
          expired: new Date(expired * 1000),
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      console.log(error);
      return Object.assign(response, {
        status: 400,
        message: "Bad requrest",
        error: 1,
      });
    }
    return response;
  },
  handleRefeshToken: async ({ refreshToken }) => {
    const response = {};
    if (!refreshToken) {
      Object.assign(response, {
        status: 401,
        message: "Unauthorizedd",
        error: 1,
      });
    } else {
      try {
        const exitToken = await KeyToken.findOne({
          where: { refresh_token: refreshToken },
        });
        if (!exitToken) {
          return Object.assign(response, {
            status: 404,
            message: "Bad request",
            error: 1,
          });
        }
        const { JWT_SECRET, JWT_EXPIRE } = process.env;
        const accessToken = jwt.sign(
          { userId: exitToken.user_id },
          JWT_SECRET,
          {
            expiresIn: JWT_EXPIRE,
          }
        );
        Object.assign(response, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          status: 200,
          error: 0,
        });
      } catch (error) {
        Object.assign(response, {
          status: 500,
          message: "Unauthorized",
          error: 1,
        });
      }
    }
    return response;
  },
  handleUpdateUser: async (body, id) => {
    console.log(body);
    const response = {};
    try {
      await User.update(body, {
        where: { id: id.id },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: 1,
      });
    }
    return response;
  },
  handleUpdatePassword: async (body) => {
    const response = {};
    if (!body) {
      return Object.assign(response, {
        status: 400,
        message: "Vui lòng nhập thông tin",
        error: 1,
      });
    }
    const schema = object({
      password: string("Vui lòng nhập đúng định dạng!!!")
        .required("Trường này bắt buộc phải nhập")
        .min(8, "mật khẩu ít nhất 8 ký tự"),
      repeat_password: string("Vui lòng nhập đúng định dạng!!!")
        .required("Trường này bắt buộc phải nhập")
        .min(8, "mật khẩu ít nhất 8 ký tự"),
    });
    try {
      const result = await schema.validate(body, {
        abortEarly: false,
      });
      const user = await User.findByPk(body.id);
      if (!user) {
        return Object.assign(response, {
          status: 401,
          message: "Unauthorized",
          error: 1,
        });
      }
      if (result.password !== result.repeat_password) {
        return Object.assign(response, {
          status: 400,
          message: "Mật khônng nhập lại không khớp",
          error: 1,
        });
      }

      const match = await bcrypt.compare(result.password, user.password);
      if (match) {
        return Object.assign(response, {
          status: 400,
          message: "Bạn đang sử dụng mật khẩu cũ",
          error: 1,
        });
      }
      const passwordHash = await bcrypt.hash(result.repeat_password, 10);
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
        { where: { id: result.id } }
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
