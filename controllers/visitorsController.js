const VisitorForm = require("../models/visitorsModel");

// Get all visitor forms with pagination and filtering by referenceId
exports.getVisitorForms = async (req, res) => {
  try {
    const { page = 1, limit = 10, referenceId } = req.query; // Add referenceId as query parameter
    const skip = (page - 1) * limit;
    const query = {};

    if (referenceId) {
      query.referenceId = referenceId;
    }

    // Find visitor forms with pagination and optional filtering
    const visitorForms = await VisitorForm.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalForms = await VisitorForm.countDocuments(query);

    res.status(200).json({ totalForms, visitorForms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single visitor form by ID
exports.getVisitorFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const visitorForm = await VisitorForm.findById(id);
    if (!visitorForm) {
      return res.status(404).json({ error: "Visitor form not found" });
    }
    res.status(200).json(visitorForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new visitor form
exports.createVisitorForm = async (req, res) => {
  try {
    const {
      visitorName,
      requiresParking,
      parkingExpiration,
      vehicleMake,
      vehicleColor,
      licensePlateProvince,
      licensePlate,
      comments,
      referenceId,
      unitNumber,
      visitorType,
      creatorInfo,
      createdAt,
    } = req.body;
    console.log(req.body);

    if (!visitorName || !unitNumber) {
      return res
        .status(400)
        .json({ error: "Visitor name and unit number are required" });
    }

    // Check the number of passes used for this unit in the current month
    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const passesUsed = await VisitorForm.countDocuments({
      unitNumber,
      requiresParking: true,
      parkingExpiration: { $gte: currentMonthStart },
    });

    if (passesUsed >= 8) {
      return res.status(400).json({
        error: `Unit ${unitNumber} has exceeded the limit of 8 overnight passes for this month.`,
      });
    }

    // Create a new visitor form
    const visitorForm = new VisitorForm({
      visitorName,
      requiresParking,
      parkingExpiration,
      vehicleMake,
      vehicleColor,
      licensePlateProvince,
      licensePlate,
      comments,
      referenceId,
      unitNumber,
      visitorType,
      creatorInfo,
      createdAt,
    });
    await visitorForm.save();

    res.status(201).json({
      message: `Visitor form created successfully. Unit ${unitNumber} has used ${
        passesUsed + 1
      } of 8 passes.`,
      visitorForm,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a visitor form by ID
exports.deleteVisitorFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const visitorForm = await VisitorForm.findByIdAndDelete(id);
    if (!visitorForm) {
      return res.status(404).json({ error: "Visitor form not found" });
    }

    res.status(200).json({ message: "Visitor form deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing visitor form by ID
exports.updateVisitorFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      visitorName,
      requiresParking,
      parkingExpiration,
      vehicleMake,
      vehicleColor,
      licensePlateProvince,
      licensePlate,
      comments,
      referenceId,
      creatorInfo,
      createdAt,
    } = req.body;

    const visitorForm = await VisitorForm.findByIdAndUpdate(
      id,
      {
        visitorName,
        requiresParking,
        parkingExpiration,
        vehicleMake,
        vehicleColor,
        licensePlateProvince,
        licensePlate,
        comments,
        referenceId,
        creatorInfo,
        createdAt,
      },
      { new: true, runValidators: true },
    );

    if (!visitorForm) {
      return res.status(404).json({ error: "Visitor form not found" });
    }

    res
      .status(200)
      .json({ message: "Visitor form updated successfully", visitorForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count total visitor forms
exports.countVisitorForms = async (req, res) => {
  try {
    const count = await VisitorForm.countDocuments();
    res.status(200).json({ totalForms: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search visitor forms by various fields (date, unit number, etc.)

exports.searchVisitorForms = async (req, res) => {
  try {
    // Build a dynamic search query based on the provided query parameters
    const searchQuery = buildSearchQuery(req.query);
    console.log(searchQuery);

    const visitorForms = await VisitorForm.find(searchQuery);
    res.status(200).json({
      totalForms: visitorForms.length,
      visitorForms,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function buildSearchQuery(params) {
  const query = {};
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      // Use regular expressions for string fields for partial matching
      if (
        typeof params[key] === "string" &&
        key !== "createdAt" &&
        key !== "parkingExpiration"
      ) {
        query[key] = new RegExp(params[key], "i");
      } else if (key === "createdAt" || key === "parkingExpiration") {
        // Handle dates separately
        // Assuming date is passed in YYYY-MM-DD format
        const date = new Date(params[key]);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query[key] = {
          $gte: date,
          $lt: nextDay,
        };
      } else {
        query[key] = params[key];
      }
    }
  });
  return query;
}

function buildSearchQuery(params) {
  const query = {};
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      // Use regular expressions for string fields for partial matching
      if (
        typeof params[key] === "string" &&
        key !== "createdAt" &&
        key !== "parkingExpiration"
      ) {
        query[key] = new RegExp(params[key], "i");
      } else if (key === "createdAt" || key === "parkingExpiration") {
        // Handle dates separately
        // Assuming date is passed in YYYY-MM-DD format
        const date = new Date(params[key]);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query[key] = {
          $gte: date,
          $lt: nextDay,
        };
      } else {
        query[key] = params[key];
      }
    }
  });
  return query;
}
