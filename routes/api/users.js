const express = require("express");
const router = express.Router();
const ctrlUser = require("../../controllers/users");
const { authMiddleware, avatarUploadMiddleware } = require("../../middleware");

router.patch("/", authMiddleware, ctrlUser.updateSub);

router.patch(
  "/avatars",
  authMiddleware,
  avatarUploadMiddleware,
  ctrlUser.updateImageURL
);

router.post("/signup", ctrlUser.create);

router.post("/login", ctrlUser.logIn);

router.post("/verify", ctrlUser.resendVerificationEmail);

router.get("/logout", authMiddleware, ctrlUser.logOut);

router.get("/current", authMiddleware, ctrlUser.getCurrent);

router.get("/verify/:verificationToken", ctrlUser.checkUser);

module.exports = router;
