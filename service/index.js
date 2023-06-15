const Contact = require("./schemas/contact");
const User = require("./schemas/user");

const getAllContacts = async (owner) => {
  return Contact.find({ owner });
};

const getContactById = (contactId, owner) => {
  return Contact.findOne({ _id: contactId, owner });
};

const createContact = ({ name, email, phone }, owner) => {
  return Contact.create({ name, email, phone, owner });
};

const updateContact = (contactId, fields, owner) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner }, fields, {
    new: true,
  });
};

const removeContact = (contactId, owner) => {
  return Contact.findOneAndRemove({ _id: contactId, owner });
};

const updateStatusContact = (contactId, favorite, owner) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    { $set: { favorite } },
    { new: true }
  );
};

const createtUser = (email, password) => {
  return User.create({ email, password });
};

const getUser = (email) => {
  return User.findOne({ email });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  createtUser,
  getUser,
};
