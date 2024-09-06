const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/propertyController");
const verifyToken = require("../middleware/authMiddleware");

// Existing routes
router.get("/propertys", verifyToken, PropertyController.getProperties);
router.get("/property/:id", verifyToken, PropertyController.getPropertyById);
router.post("/property", verifyToken, PropertyController.createProperty);
router.delete(
  "/property/:id",
  verifyToken,
  PropertyController.deletePropertyById,
);
router.put("/property/:id", verifyToken, PropertyController.updatePropertyById);
router.get("/propertys/count", verifyToken, PropertyController.countProperties);
router.get(
  "/propertys/search",
  verifyToken,
  PropertyController.searchProperties,
);

// New route to fetch properties by referenceEmail
router.get(
  "/propertys/user",
  verifyToken,
  PropertyController.getUserProperties,
);

module.exports = router;
