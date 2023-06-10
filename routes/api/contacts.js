const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controllers/contacts");
const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.delete("/:contactId", validateObjectId, ctrlContact.remove);

router.put("/:contactId", validateObjectId, ctrlContact.update);

router.patch("/:contactId/favorite", ctrlContact.switchStatus);

module.exports = router;
