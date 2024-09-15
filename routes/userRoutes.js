const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware"); // Middleware to verify JWT
const verifyAdmin = require("../middleware/verifyAdmin");
const checkUrlSecurity = require("../middleware/checkUrlSecurity");

// Public Routes
router.post("/user", userController.createOrUpdateUser);
router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getUserById);
router.get("/users/search", userController.searchUsers);
router.get("/users/email", userController.getUserByEmail);

router.get(
  "/users/reference/:referenceId",
  userController.getUsersByReferenceId,
);
// Protected Route to check user role
router.get(
  "/users/role",
  verifyAdmin,
  verifyToken,
  userController.checkUserRole,
); // Route for checking user role
// Admin-only Routes
router.put("/user/:id", userController.updateUser); // Only admins can update role/status
router.delete(
  "/user/:id",
  verifyAdmin,
  verifyToken,
  userController.deleteUserById,
); // Only admins can delete users
module.exports = router;
