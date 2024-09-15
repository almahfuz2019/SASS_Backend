const mongoose = require("mongoose");

const ParcelSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
  },
  recipientUnit: {
    type: String,
    required: true,
  },
  courier: {
    type: String,
    required: true,
  },
  trackingNumber: {
    type: String,
    default: null,
  },
  isPerishable: {
    type: Boolean,
    default: false,
  },
  storageSpot: {
    type: String,
    default: null,
  },
  packageDetails: {
    type: String,
    default: "",
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  receivedBy: {
    type: String,
    default: null, // Field to store the security guard's information
  },
  packageRef: {
    type: String, // 6-digit unique reference number
    unique: true,
  },
  deliveredAt: {
    type: Date, // Store the date and time of delivery
    default: null, // Default is null until the parcel is marked as delivered
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to auto-generate a 6-digit unique package reference number
ParcelSchema.pre("save", async function (next) {
  const parcel = this;
  if (!parcel.packageRef) {
    let uniqueRef;
    let exists = true;

    // Generate a unique 6-digit number and ensure it's not already in use
    while (exists) {
      uniqueRef = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit number
      exists = await mongoose.models.Parcel.findOne({ packageRef: uniqueRef });
    }
    parcel.packageRef = uniqueRef;
  }
  next();
});
module.exports = mongoose.model("Parcel", ParcelSchema);
