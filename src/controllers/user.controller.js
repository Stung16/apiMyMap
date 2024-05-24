const { handleUpload } = require("../services/mindmap.service");
const {
  handleUpdatePassword,
  handleUpdateUser,
} = require("../services/user.service");
const { errorRespone, successRespone } = require("../utils/respone");

module.exports = {
  upload: async (req, res) => {
    const result = await handleUpload(req.file);
    if (result?.error === 1) {
      return errorRespone(res, result.status, result.message, {});
    } else {
      return successRespone(res, 201, result?.message, result?.data, {});
    }
  },
  updateUser: async (req, res) => {
    const id = req.user.dataValues;
    const result = await handleUpdateUser(req.body, id);
    if (result?.error === 1) {
      return errorRespone(res, result.status, result.message, {});
    } else {
      return successRespone(res, result.status, result?.message, "", {});
    }
  },
  updatePassword: async (req, res) => {
    const result = await handleUpdatePassword({
      ...req.body,
      ...req.user.dataValues,
    });
    if (result?.error === 1) {
      return errorRespone(res, result.status, result.message, {});
    } else {
      return successRespone(res, result.status, result?.message, "", {});
    }
  },
};
