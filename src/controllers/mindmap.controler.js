const {
  handleCreateMap,
  handleGetMapById,
  handleUpdatemap,
  handleGetAllMap,
  handleDeleteMapById,
  handleDeleteMapByIds,
  handleGetAllMapDeleted,
  handleDeleteRecoveryMapById,
  handleDeleteRecoveryMapByIds,
  handleReStoreMapById,
  handleReStoreMapByIds,
} = require("../services/mindmap.service");
const { successRespone, errorRespone } = require("../utils/respone");

module.exports = {
  getAllMap: async (req, res) => {
    const result = await handleGetAllMap({
      ...req.query,
      ...req.user.dataValues,
    });
    res.json(result);
  },
  createMindmap: async (req, res) => {
    const result = await handleCreateMap(req.body);
    res.json(result);
  },
  getMindmapById: async (req, res) => {
    const result = await handleGetMapById(req.params);
    res.json(result);
  },
  updateMap: async (req, res) => {
    const result = await handleUpdatemap({ body: req.body, id: req.params.id });
    res.json(result);
  },
  deletById: async (req, res) => {
    const result = await handleDeleteMapById(req.params);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  deletByIds: async (req, res) => {
    const result = await handleDeleteMapByIds(req.body);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  getAllMapDeleted: async (req, res) => {
    const result = await handleGetAllMapDeleted({
      ...req.query,
      ...req.user.dataValues,
    });
    res.json(result);
  },
  deletRecoveryById: async (req, res) => {
    const result = await handleDeleteRecoveryMapById(req.params);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  deletRecoveryByIds: async (req, res) => {
    const result = await handleDeleteRecoveryMapByIds(req.body);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  reStoreMapById: async (req, res) => {
    const result = await handleReStoreMapById(req.params);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
  reStoreMapByIds: async (req, res) => {
    const result = await handleReStoreMapByIds(req.body);
    if (result?.error === 0) {
      return successRespone(res, 200, "Success", "", {});
    } else {
      return errorRespone(res, result.status, result.message, {});
    }
  },
};
