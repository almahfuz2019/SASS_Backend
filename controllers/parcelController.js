const Parcel = require("../models/parcelModel");

exports.getAllParcels = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const parcels = await Parcel.find().skip(skip).limit(limit);
    const totalParcels = await Parcel.countDocuments();
    res.status(200).json({ totalParcels, parcels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createParcel = async (req, res) => {
  try {
    const newParcel = new Parcel(req.body);
    await newParcel.save();
    res.status(201).json(newParcel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateParcelById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDelivered, deliveredAt } = req.body; // Include deliveredAt field

    const updatedParcel = await Parcel.findByIdAndUpdate(
      id,
      { isDelivered, deliveredAt }, // Update both isDelivered and deliveredAt
      { new: true },
    );

    if (!updatedParcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    res.status(200).json(updatedParcel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteParcelById = async (req, res) => {
  try {
    const deletedParcel = await Parcel.findByIdAndDelete(req.params.id);
    if (!deletedParcel)
      return res.status(404).json({ message: "Parcel not found" });
    res.status(200).json({ message: "Parcel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchParcels = async (req, res) => {
  // Function to build a dynamic search query based on request parameters
  function buildSearchQuery(params) {
    const query = {};
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        switch (key) {
          case "recipientName":
          case "courier":
          case "packageDetails":
          case "storageSpot":
            // Create a case-insensitive regular expression for partial matching
            query[key] = new RegExp(params[key], "i");
            break;
          case "isPerishable":
            // Convert string to boolean for the search
            query[key] = params[key] === "true";
            break;
          case "createdAt":
            // Handle date range searching from the specified date to the end of that day
            const date = new Date(params[key]);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query[key] = { $gte: date, $lt: nextDay };
            break;
          default:
            // Exact match for any other parameters
            query[key] = params[key];
            break;
        }
      }
    });
    return query;
  }

  try {
    const query = buildSearchQuery(req.query); // Build the search query from request parameters
    const parcels = await Parcel.find(query); // Use the constructed query to search for parcels
    res.status(200).json({
      totalResults: parcels.length,
      parcels,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
