const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  listingType: {
    type: String,
    enum: ["Sale", "Rent"],
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  squareFootage: {
    type: Number,
    required: true,
  },
  furnishing: {
    type: String,
    enum: ["Furnished", "Semi-furnished", "Unfurnished"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  referenceEmail: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of strings to store image URLs or file paths
    validate: {
      validator: function (array) {
        return array.length >= 1; // Ensure at least 1 image is submitted
      },
      message: "At least one image is required",
    },
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", PropertySchema);
