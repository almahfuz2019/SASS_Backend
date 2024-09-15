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
      return res
        .status(400)
        .json({ error: "User already exists, please use the update route." });
    }

    // Create a new user (role defaults to empty string)
    user = new User({ name, email });
    await user.save();

    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user by referenceId
// Get users by referenceId
// Get users by referenceId
exports.getUsersByReferenceId = async (req, res) => {
  try {
    const { referenceId } = req.params;

    // Find users by referenceId
    const users = await User.find({ referenceId });
    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found with the given referenceId." });
    }

    res.status(200).json({ totalUsers: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users with pagination and optional referenceId filtering
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, referenceId } = req.query;
    const skip = (page - 1) * limit;

    // Create a query object for filtering
    const query = {};

    // If referenceId is provided, add it to the query
    if (referenceId) {
      query.referenceId = referenceId;
    }

    // Find users with pagination and filtering by referenceId if provided
    const users = await User.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    const totalUsers = await User.countDocuments(query); // Count the total number of users for pagination

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
// Update user role and status
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, referenceId, uniqueID, email, role, status } = req.body;
    console.log(req.body);

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent updating email once set
    if (email && email !== user.email) {
      return res
        .status(400)
        .json({ error: "Email cannot be updated once set." });
    }

    // Retain the original referenceId if it's already set, even if the user tries to update it
    if (user.referenceId && referenceId && referenceId !== user.referenceId) {
      req.body.referenceId = user.referenceId; // Revert to the original referenceId
    }

    // Retain the original uniqueID if it's already set, even if the user tries to update it
    if (user.uniqueID && uniqueID && uniqueID !== user.uniqueID) {
      req.body.uniqueID = user.uniqueID; // Revert to the original uniqueID
    }

    // Ensure that only one of referenceId or uniqueID is provided
    if (referenceId && uniqueID) {
      return res
        .status(400)
        .json({ error: "Cannot have both referenceId and uniqueID." });
    }

    // Check if the referenceId exists as a uniqueID in another user
    if (referenceId && referenceId !== user.referenceId) {
      const uniqueIDExists = await User.findOne({ uniqueID: referenceId });
      if (!uniqueIDExists) {
        return res.status(400).json({
          error:
            "This referenceId does not exist as a uniqueID in any other user.",
        });
      }
    }

    // Update allowed fields (name, role, status)
    user.name = name || user.name;
    user.role = role || user.role;
    
    // Only update the status if it's passed in the request body
    if (status !== undefined) {
      user.status = status;
    }

    // Retain the original referenceId and uniqueID if they are already set
    user.referenceId = user.referenceId || referenceId;
    user.uniqueID = user.uniqueID || uniqueID;

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

// Search users by name or email (and restrict by uniqueID)
// Search users by email (restricted by referenceId)
// Search users by email (restricted by referenceId)
// Search users by email or name (restricted by referenceId)


// Search users by email or name (restricted by referenceId)
exports.searchUsers = async (req, res) => {
  try {
    const { query, referenceId } = req.query;

    if (!query || !referenceId) {
      return res
        .status(400)
        .json({ error: "Search query and referenceId are required" });
    }

    // First, try to find an exact match by email or name
    let exactMatchUser = await User.findOne({
      referenceId,
      $or: [{ email: query }, { name: query }],
    });

    // If no exact match is found, search for a partial match (case-insensitive)
    if (!exactMatchUser) {
      const regex = new RegExp(query, "i"); // Case-insensitive regex for partial match
      const partialMatches = await User.find({
        referenceId,
        $or: [{ email: regex }, { name: regex }],
      }).sort({ createdAt: -1 }); // Sort by creation date to get the latest user

      // If no partial matches are found, return a message for admin (no error)
      if (partialMatches.length === 0) {
        return res.status(200).json({
          message:
            "No users found. Please inform the admin for further assistance.",
          users: [],
        });
      }

      // Return the last (most recent) match from the partial matches
      return res
        .status(200)
        .json({ totalUsers: 1, users: [partialMatches[0]] });
    }

    // Return the exact match if found
    return res.status(200).json({ totalUsers: 1, users: [exactMatchUser] });
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
// Get a user by email
// Get a user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query; // Get email from the query params

  try {
    // Check if the email is present
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Perform a case-insensitive search on the email field
    const regex = new RegExp(email, "i");
    const user = await User.findOne({ email: regex });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return the user data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
