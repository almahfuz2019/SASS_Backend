const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Routes
router.get("/contacts", contactController.getContacts);
router.get("/contact/:id", contactController.getContactById);
router.post("/contact", contactController.createContact);
router.delete("/contact/:id", contactController.deleteContactById);
router.put("/contact/:id", contactController.updateContactById);
router.get("/contacts/count", contactController.countContacts);
router.get("/contacts/search", contactController.searchContacts);

module.exports = router;
