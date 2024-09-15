const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
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
    enum: ["user", "admin", "moderator"],
    default: "user", // Default role is "user"
  },
  uniqueID: {
    type: Number,
    required: true, // You can set this to true if store number is mandatory
  },
  disabled: {
    type: Boolean,
    default: false, // Default is enabled
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("owner", OwnerSchema);
