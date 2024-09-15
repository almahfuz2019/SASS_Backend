const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["", "user", "admin", "moderator"], // Allow an empty string and valid roles
    default: "", // Default role is an empty string
  },
  status: {
    type: String,
    default: false, // Default is enabled
  },
  referenceId: {
    type: String,
    minlength: 11,
    maxlength: 11,
    match: /^[a-z0-9-]+$/, // Small letters, numbers, and hyphens
    sparse: true,
    default: null, // Ensure referenceId is initialized as null
  },
  uniqueID: {
    type: String,
    minlength: 11,
    maxlength: 11,
    match: /^[a-z0-9-]+$/, // Small letters, numbers, and hyphens
    sparse: true,
    default: null, // Ensure uniqueID is initialized as null
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
