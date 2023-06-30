const Joi = require("joi").extend(require("joi-phone-number"));

const validateUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/
  ),
});

const validateContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().phoneNumber().required(),
  favorite: Joi.boolean(),
});

module.exports = {
  validateUser,
  validateContact,
};
