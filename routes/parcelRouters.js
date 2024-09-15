const express = require("express");
const router = express.Router();
const parcelController = require("../controllers/parcelController");

router.get("/parcels", parcelController.getAllParcels);
router.get("/parcel/:id", parcelController.getParcelById);
router.post("/parcel", parcelController.createParcel);
router.put("/parcel/:id", parcelController.updateParcelById);
router.delete("/parcel/:id", parcelController.deleteParcelById);
router.get("/parcels/search", parcelController.searchParcels);

module.exports = router;
