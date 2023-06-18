const express = require("express");
const router = express.Router();
const ctrlUser = require("../../controllers/users");
const ctrlAuth = require("../../middleware/auth");

router.patch("/", ctrlAuth.auth, ctrlUser.updateSub);

router.post("/signup", ctrlUser.create);

router.post("/login", ctrlUser.logIn);

router.get("/logout", ctrlAuth.auth, ctrlUser.logOut);

router.get("/current", ctrlAuth.auth, ctrlUser.getCurrent);

module.exports = router;
