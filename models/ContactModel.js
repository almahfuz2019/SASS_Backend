const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  referenceId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["unread", "read"], // Set the possible values for status
    default: "unread", // Default value is unread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
