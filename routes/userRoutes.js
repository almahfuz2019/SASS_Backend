const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/user", userController.createOrUpdateUser);
router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getUserById);
router.delete("/user/:id", userController.deleteUserById);
router.get("/users/count", userController.countUsers);
router.get("/users/search", userController.searchUsers);

module.exports = router;
