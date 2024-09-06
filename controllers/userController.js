const User = require("../models/userModel");

// Create or update user
exports.createOrUpdateUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log(req.body);

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

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role and status
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, disabled } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (role) user.role = role;
    if (disabled !== undefined) user.disabled = disabled;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, "i"); // Case-insensitive regex for search

    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
    });

    res.status(200).json({ totalUsers: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Check the user's role
// Check the user's role
exports.checkUserRole = async (req, res) => {
  try {
    // Assuming req.user is populated by verifyToken middleware
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's role
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
