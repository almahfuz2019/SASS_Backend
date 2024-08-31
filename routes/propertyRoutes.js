const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/propertyController");

// Routes
router.get("/propertys", PropertyController.getProperties);
router.get("/property/:id", PropertyController.getPropertyById);
router.post("/property", PropertyController.createProperty);
router.delete("/property/:id", PropertyController.deletePropertyById);
router.put("/property/:id", PropertyController.updatePropertyById);
router.get("/propertys/count", PropertyController.countProperties);
router.get("/propertys/search", PropertyController.searchProperties);

module.exports = router;
