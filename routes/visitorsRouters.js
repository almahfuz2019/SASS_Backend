const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorsController");
const verifyAdmin = require("../middleware/verifyAdmin");

// Routes
router.get("/visitors", visitorController.getVisitorForms); // Get all visitors with pagination
router.get("/visitor/:id", visitorController.getVisitorFormById); // Get a single visitor form by ID
router.post("/visitor", visitorController.createVisitorForm); // Create a new visitor form
router.delete("/visitor/:id", visitorController.deleteVisitorFormById); // Delete a visitor form by ID
router.put("/visitor/:id", visitorController.updateVisitorFormById); // Update an existing visitor form by ID
router.get("/visitors/count", visitorController.countVisitorForms); // Get total visitor count
router.get("/visitors/search", visitorController.searchVisitorForms); // Search visitor forms by name or vehicle make

module.exports = router;
