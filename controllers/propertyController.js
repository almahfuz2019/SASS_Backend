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
      images, // Added images field
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
      !referenceEmail ||
      !images ||
      images.length === 0 // Ensure images are provided
    ) {
      return res.status(400).json({
        error: "All fields including at least one image are required",
      });
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
      images, // Add images array
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
      images, // Add images field for updating images
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
        images, // Update images array
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

// Search properties by multiple fields (title, propertyType, listingType, address, bedrooms, bathrooms, price, etc.)
exports.searchProperties = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // Case-insensitive search

    // Search across multiple fields
    const properties = await Property.find({
      $or: [
        { title: regex },
        { propertyType: regex },
        { listingType: regex },
        { "address.street": regex },
        { "address.city": regex },
        { "address.state": regex },
        { "address.country": regex },

        { sellerName: regex },
      { contactNumber: regex },
      ],
    });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch properties for the logged-in user based on referenceEmail
exports.getUserProperties = async (req, res) => {
  try {
    const { email } = req.user; // Extract the user's email from the token

    if (!email) {
      return res.status(400).json({ error: "User email is required" });
    }

    // Find properties where referenceEmail matches the authenticated user's email
    const properties = await Property.find({ referenceEmail: email });

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json({ error: "No properties found for this user" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
