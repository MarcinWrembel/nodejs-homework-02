const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controllers/contacts");

router.get("/",  ctrlContact.get);

router.get("/:contactId",  ctrlContact.getById);

router.post("/",  ctrlContact.create);

router.delete("/:contactId", ctrlContact.remove);

router.put("/:contactId",  ctrlContact.update);

// if (name === undefined && email === undefined && phone === undefined) {
//   res.status(400).json({ message: "missing fields" });
//   return;
// }

module.exports = router;
