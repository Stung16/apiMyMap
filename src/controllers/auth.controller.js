const {
  handleLoginWithGoogle,
  handleLoginWithGoogleCallback,
  handleForgotPass,
} = require("../services/auth.service");
const {
  handleLogin,
  handleResgiter,
  handleLogOut,
  handleRefeshToken,
} = require("../services/user.service");
const { successRespone, errorRespone } = require("../utils/respone");

module.exports = {
  login: async (req, res) => {
    const result = await handleLogin(req.body);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", result, {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  
  resgiter: async (req, res) => {
    const result = await handleResgiter(req.body);
    if (result?.error === 0) {
      return successRespone(res, result.status, "Success", '', {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  getProfileByToken: async (req, res) => {
    const response = {
      status: 200,
      message: "success",
      data: req.user.dataValues,
    };
    res.status(response.status).json(response);
  },
  logout: async (req, res) => {
    const result = await handleLogOut(req.user);
    res.json(result);
  },
  refeshToken: async (req, res) => {
    const result = await handleRefeshToken(req.body);
    if (result?.error === 0) {
      return successRespone(res, result.status, "Success", result, {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
    // res.json(result);
  },
  LoginWithGoogle: async (req, res) => {
    const result = await handleLoginWithGoogle(req);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", result, {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  LoginWithGoogleCallback: async (req, res) => {
    const result = await handleLoginWithGoogleCallback(req);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", result, {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  forgotPass: async (req, res) => {
    const result = await handleForgotPass(req.body);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
};
