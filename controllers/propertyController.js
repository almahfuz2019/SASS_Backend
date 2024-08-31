const Property = require("../models/propertyModel");
// Get all properties with pagination
exports.getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalProperties = await Property.countDocuments();

    res.status(200).json({ totalProperties, properties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      propertyType,
      listingType,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      furnishing,
      price,
      sellerName,
      contactNumber,
      referenceEmail,
    } = req.body;

    if (
      !title ||
      !propertyType ||
      !listingType ||
      !address ||
      !bedrooms ||
      !bathrooms ||
      !squareFootage ||
      !furnishing ||
      !price ||
      !sellerName ||
      !contactNumber ||
      !referenceEmail
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new property
    const property = new Property({
      title,
      propertyType,
      listingType,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      furnishing,
      price,
      sellerName,
      contactNumber,
      referenceEmail,
    });
    await property.save();
    res
      .status(201)
      .json({ message: "Property created successfully", property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a property by ID
exports.deletePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing property by ID
exports.updatePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      propertyType,
      listingType,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      furnishing,
      price,
      sellerName,
      contactNumber,
      referenceEmail,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      {
        title,
        propertyType,
        listingType,
        address,
        bedrooms,
        bathrooms,
        squareFootage,
        furnishing,
        price,
        sellerName,
        contactNumber,
        referenceEmail,
      },
      { new: true, runValidators: true },
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count total properties
exports.countProperties = async (req, res) => {
  try {
    const count = await Property.countDocuments();
    res.status(200).json({ totalProperties: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search properties by title or address
exports.searchProperties = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(query, "i");
    const properties = await Property.find({
      $or: [
        { title: regex },
        { "address.street": regex },
        { "address.city": regex },
        { "address.state": regex },
      ],
    });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
