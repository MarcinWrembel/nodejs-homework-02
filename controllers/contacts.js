const service = require("../service");

const get = async (_, res, next) => {
  try {
    const results = await service.getAllContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await service.getContactById(id);
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
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await service.removeTask(id);
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
        message: `Not found contact id: ${id}`,
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

  try {
    const result = await service.createContact({ name, email, phone });

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
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const result = await service.updateContact(id, { name, email, phone });
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
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const switchStatus = async (res, req, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  try {
    const result = await service.updateStatusContact(id, favorite);
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
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  get,
  getById,
  remove,
  create,
  update,
  switchStatus,
};
