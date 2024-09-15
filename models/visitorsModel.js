const mongoose = require("mongoose");

const VisitorFormSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: true,
  },
  requiresParking: {
    type: Boolean,
    default: false,
  },
  parkingExpiration: {
    type: Date,
    default: null,
  },
  vehicleMake: {
    type: String,
    default: null,
  },
  vehicleColor: {
    type: String,
    default: null,
  },
  licensePlateProvince: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  licensePlate: {
    type: String,
    default: null,
  },
  comments: {
    type: String,
    default: "",
  },
  referenceId: {
    type: String,
    required: true,
  },
  creatorInfo: {
    type: String,
    required: true,
  },
  unitNumber: {
    type: String,
    required: true,
  },
  visitorType: {
    type: String,
    enum: ["Visitor", "Greg's Plumbing", "Building", "Other"],
    default: "Visitor",
  },
  createdAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("VisitorForm", VisitorFormSchema);
