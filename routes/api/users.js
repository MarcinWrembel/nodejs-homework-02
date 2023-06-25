const express = require("express");
const router = express.Router();
const ctrlUser = require("../../controllers/users");
const { authMiddleware, avatarUploadMiddleware } = require("../../middleware");

// const avatarUploadMiddleware = require("../../middleware/avatarUpload");

router.patch("/", authMiddleware, ctrlUser.updateSub);

router.patch(
  "/avatars",
  authMiddleware,
  avatarUploadMiddleware,
  ctrlUser.updateImageURL
);

router.post("/signup", ctrlUser.create);

router.post("/login", ctrlUser.logIn);

router.get("/logout", authMiddleware, ctrlUser.logOut);

router.get("/current", authMiddleware, ctrlUser.getCurrent);

module.exports = router;
