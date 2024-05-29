var express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage, limit: { fileSize: 1024 * 1024 * 100 } }); //limit 100MB
const mindmapControler = require("../controllers/mindmap.controler");
const authControler = require("../controllers/auth.controller");
const userControler = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require("passport");

var router = express.Router();

// users
router.post("/api/auth/login", authControler.login);
router.post("/api/auth/refeshtoken", authControler.refeshToken);
router.get(
  "/api/auth/profile",
  authMiddleware,
  authControler.getProfileByToken
);
router.get("/api/auth/logout", authMiddleware, authControler.logout);
router.post("/api/auth/resgiter", authControler.resgiter);
router.post(
  "/api/upload",
  upload.single("file"),
  userControler.upload
);
router.post("/api/user", authMiddleware, userControler.updateUser);
router.post("/api/auth/password", authMiddleware, userControler.updatePassword);
router.get("/auth/google", authControler.LoginWithGoogle);
router.post("/auth/forgot", authControler.forgotPass);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  authControler.LoginWithGoogleCallback
);
// mindmaps
router.get("/api/mindmaps/:id", mindmapControler.getMindmapById);
router.get("/api/mindmaps", authMiddleware, mindmapControler.getAllMap);
router.post("/api/mindmaps",authMiddleware, mindmapControler.createMindmap);
router.patch("/api/mindmaps/:id",authMiddleware, mindmapControler.updateMap);
router.delete("/api/mindmaps/:id",authMiddleware, mindmapControler.deletById);
router.post("/api/delete/mindmaps",authMiddleware, mindmapControler.deletByIds);
router.get(
  "/api/delete/mindmaps",
  authMiddleware,
  mindmapControler.getAllMapDeleted
);
router.delete("/api/deleted/mindmaps/:id",authMiddleware, mindmapControler.deletRecoveryById);
router.post("/api/deleted/mindmaps", mindmapControler.deletRecoveryByIds);
router.get("/api/restore/mindmaps/:id", mindmapControler.reStoreMapById);
router.post("/api/restore/mindmaps", mindmapControler.reStoreMapByIds);

// auth

module.exports = router;
