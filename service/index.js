const Contact = require("../models/contact");
const User = require("../models/user");

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

const getFavoriteContacts = (owner, favorite) => {
  return Contact.find({ owner, favorite });
};

const createtUser = (email, password) => {
  return User.create({ email, password });
};

const getUser = (email) => {
  return User.findOne({ email });
};

const getUserWithToken = (verificationToken) => {
  return User.findOne({ verificationToken });
};

const updateSubscription = (subscription, owner) => {
  return User.findByIdAndUpdate(
    { _id: owner },
    { $set: { subscription } },
    { new: true }
  );
};

const updateAvatar = (avatarURL, owner) => {
  return User.findByIdAndUpdate(
    { _id: owner },
    { $set: { avatarURL } },
    { new: true }
  );
};

module.exports = {
  getAllContacts,
  getContactById,
  getUser,
  getUserWithToken,
  createContact,
  createtUser,
  removeContact,
  getFavoriteContacts,
  updateAvatar,
  updateContact,
  updateStatusContact,
  updateSubscription,
};
