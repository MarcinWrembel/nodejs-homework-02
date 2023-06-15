const Contact = require("./schemas/contact");
const  User = require("./schemas/user");

const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = (contactId) => {
  return Contact.findOne({ _id: contactId });
};


const createContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = (contactId, fields) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, fields, { new: true });
};

const removeContact = (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const updateStatusContact = (contactId, favorite) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, { $set: { favorite } }, { new: true });
};

const createtUser= (email,password)=>{
  return User.create({email,password})
}

const getUser= (email)=>{
  return User.findOne({email})
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  createtUser,
  getUser
};
