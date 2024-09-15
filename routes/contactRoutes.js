const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const contactController = require("../controllers/contactController");

// Routes
router.get("/contacts", contactController.getContacts);
router.get("/contact/:id", verifyToken, contactController.getContactById);
router.post("/contact", contactController.createContact);
router.delete("/contact/:id", verifyToken, contactController.deleteContactById);
router.put("/contact/:id", verifyToken, contactController.updateContactById);
router.get("/contacts/count", verifyToken, contactController.countContacts);
router.get("/contacts/search", verifyToken, contactController.searchContacts);

module.exports = router;
