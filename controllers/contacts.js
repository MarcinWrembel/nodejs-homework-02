const service = require("../service");
const { validateContact } = require("../utils/validation");

const get = async (req, res, next) => {
  const { favorite } = req.query;

  try {
    if (favorite === undefined) {
      const results = await service.getAllContacts(req.user._id);
      res.json({
        status: "success",
        code: 200,
        data: {
          contacts: results,
        },
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  try {
    const result = await service.getContactById(contactId, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  try {
    const result = await service.removeContact(contactId, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
        message: "Contact removed. File saved with updated contacts list",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id } = req.user;

  const validationResult = validateContact.validate({ name, email, phone });

  if (validationResult.error) {
    res.status(400).json({
      message: "data are invalid!",
      data: validationResult.error.message,
    });
    return;
  }

  try {
    const result = await service.createContact({ name, email, phone }, _id);

    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const { _id } = req.user;

  try {
    const result = await service.updateContact(
      contactId,
      {
        name,
        email,
        phone,
      },
      _id
    );

    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const switchStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id } = req.user;

  if (favorite === undefined) {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  try {
    const result = await service.updateStatusContact(contactId, favorite, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getFavorite = async (req, res, next) => {
  const { favorite } = req.query;
  console.log(req.user.id, favorite);

  try {
    const contacts = await service.getFavoriteContacts(req.user._id, favorite);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getById,
  remove,
  create,
  update,
  switchStatus,
  getFavorite,
};
