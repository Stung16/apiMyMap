const { object, string, number, boolean } = require("yup");
const { Mindmap, User } = require("../models/index");
const { Op } = require("sequelize");
const generateCode = require("../utils/generateCode");
const { cloudinary } = require("../../src/utils/cloudinary");

module.exports = {
  handleGetAllMap: async ({ page, limit, id, statuss, favorite, q }) => {
    const response = {};
    const options = {
      order: [["created_at", "desc"]],
      where: {
        user_id: id,
      },
    };
    if (q) {
      options.where.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    if (statuss) {
      options.where.status = statuss;
    }

    if (favorite) {
      options.where.favorite = favorite;
    }

    if (!+page || page < 0) {
      page = 1;
    }

    if (limit && Number.isInteger(+limit)) {
      options.limit = limit;
      const offset = (page - 1) * limit;
      options.offset = offset;
    }
    try {
      const { rows: mindmaps, count } = await Mindmap.findAndCountAll(options);
      return {
        mindmaps,
        count,
      };
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: 1,
      });
    }
    return response;
  },
  handleGetAllMapDeleted: async ({
    page,
    limit,
    id,
    status,
    favorite,
    key,
    q,
  }) => {
    const response = {};
    const options = {
      order: [["created_at", "desc"]],
      paranoid: false,
      where: {
        deleted_at: { [Op.ne]: null },
        user_id: id,
      },
    };
    if (q) {
      options.where.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    if (key) {
      if (key === "new") {
        Object.assign(options, {
          order: [["created_at", "desc"]],
        });
      }
      if (key === "old") {
        Object.assign(options, {
          order: [["created_at", "asc"]],
        });
      }
      if (key === "top") {
        Object.assign(options, {
          order: [["title", "asc"]],
        });
      }
      if (key === "bottom") {
        Object.assign(options, {
          order: [["title", "desc"]],
        });
      }
    }

    if (status) {
      options.where.status = status;
    }

    if (favorite) {
      options.where.favorite = favorite;
    }

    if (!+page || page < 0) {
      page = 1;
    }

    if (limit && Number.isInteger(+limit)) {
      options.limit = limit;
      const offset = (page - 1) * limit;
      options.offset = offset;
    }
    try {
      const { rows: mindmaps, count } = await Mindmap.findAndCountAll(options);
      return {
        mindmaps,
        count,
      };
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: 1,
      });
    }
    return response;
  },
  handleCreateMap: async (body) => {
    const response = {};
    if (!Array.isArray(body.nodes) || !Array.isArray(body.edges)) {
      return Object.assign(response, {
        status: 400,
        message: "egds hoawcj nodes khoong dudg dihj danjg",
        error: 1,
      });
    }
    const schema = object({
      id: string().required("trường bắt buộc phải nhập!!"),
      user_id: string().required("trường bắt buộc phải nhập!!"),
    });
    try {
      const result = await schema.validate(body, {
        abortEarly: false,
      });
      const user = await User.findByPk(result.user_id);
      if (user) {
        await Mindmap.create(result);
        Object.assign(response, {
          status: 200,
          message: "tạo thành công map!!!",
          error: 0,
        });
      } else {
        Object.assign(response, {
          status: 401,
          message: "Đã có lỗi xảy ra!!!",
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
  handleGetMapById: async ({ id }) => {
    const response = {};
    try {
      const map = await Mindmap.findByPk(id);
      if (!map) {
        return Object.assign(response, {
          status: 404,
          message: "MindMap không tồn tại",
          error: 1,
        });
      }
      Object.assign(response, {
        status: 200,
        mindmap: map,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleUpdatemap: async ({ body, id }) => {
    const response = {};
    try {
      const map = await Mindmap.findByPk(id);
      if (!map) {
        return Object.assign(response, {
          status: 404,
          message: "Mindmap không tồn tại!",
          error: 1,
        });
      }
      await Mindmap.update(body, {
        where: {
          id,
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      console.log(error);
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleDeleteMapById: async ({ id }) => {
    const response = {};
    try {
      const map = await Mindmap.findByPk(id);
      if (!map) {
        return Object.assign(response, {
          status: 404,
          message: "Mindmap không tồn tại",
          error: 1,
        });
      }
      await Mindmap.destroy({
        where: {
          id,
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleDeleteMapByIds: async ({ ids }) => {
    const response = {};
    try {
      await Mindmap.destroy({
        where: {
          id: ids,
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleDeleteRecoveryMapById: async ({ id }) => {
    const response = {};
    try {
      const map = await Mindmap.findByPk(id, {
        paranoid: false,
      });
      if (!map) {
        return Object.assign(response, {
          status: 404,
          message: "Mindmap không tồn tại",
          error: 1,
        });
      }
      await Mindmap.destroy({
        where: {
          id,
        },
        force: true,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleDeleteRecoveryMapByIds: async ({ ids }) => {
    const response = {};
    try {
      await Mindmap.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleReStoreMapById: async ({ id }) => {
    const response = {};
    try {
      const map = await Mindmap.findByPk(id, {
        paranoid: false,
      });
      if (!map) {
        return Object.assign(response, {
          status: 404,
          message: "Mindmap không tồn tại",
          error: 1,
        });
      }
      await Mindmap.restore({
        where: {
          id,
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleReStoreMapByIds: async ({ ids }) => {
    const response = {};
    try {
      await Mindmap.restore({
        where: { id: { [Op.in]: ids } },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        error: 0,
      });
    } catch (error) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request!!!",
        error: 1,
      });
    }
    return response;
  },
  handleUpload: async (file) => {
    const response = {};
    const code = generateCode();
    try {
      const res = await cloudinary.uploader.upload(file.path, {
        folder: "mymapLibrary",
        public_id: `mymapLibrary${code}`,
      });
      Object.assign(response, {
        status: 201,
        message: "Success",
        data: res,
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
};
