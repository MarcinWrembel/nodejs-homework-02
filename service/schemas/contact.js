const mongoose = require("mongoose");

const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      maxlength: [40, "Name cannot be longer than 40 characters"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
      unique: true,
      maxlength: [50, "Email cannot be longer than 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Set phone number for contact"],
      unique: true,
      maxlength: [20, "Phone number cannot be longer than 20 characters"],
    },
    favorite: {
      type: Boolean,
      default: false,
      required: [true, "Set is favorite for a contact"],
    },
  },
  { collection: "contacts", versionKey: false }
);

const Contact = mongoose.model("contacts", contactSchema);

module.exports = Contact;
