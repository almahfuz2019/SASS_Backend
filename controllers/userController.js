const User = require("../models/userModel");

// Create or update user
exports.createOrUpdateUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    // Find user by email
    let user = await User.findOne({ email });
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      await user.save();
    } else {
      // Create a new user
      user = new User({ name, email });
      await user.save();
    }
    res.status(200).json({ message: "Operation successful", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users with pagination
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(parseInt(skip)).limit(parseInt(limit));

    const totalUsers = await User.countDocuments();

    res.status(200).json({ totalUsers, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count total users
exports.countUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // Case-insensitive regex for search
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
