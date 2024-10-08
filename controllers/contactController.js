const Contact = require("../models/contactModel");

// Get all contacts with pagination and optional referenceId filtering
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, referenceId } = req.query; // Default to page 1 and limit 10
    const skip = (page - 1) * limit;

    // Build the query object for filtering by referenceId if provided
    const query = {};
    if (referenceId) {
      query.referenceId = referenceId;
    }

    // Find contacts with pagination and filtering
    const contacts = await Contact.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalContacts = await Contact.countDocuments(query);

    res.status(200).json({ totalContacts, contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { email, message, referenceId } = req.body;
    console.log(req.body);

    if (!email || !message || !referenceId) {
      return res
        .status(400)
        .json({ error: "Email, message, and referenceId are required" });
    }

    // Create a new contact
    const contact = new Contact({ email, message, referenceId });
    await contact.save();

    res.status(201).json({ message: "Contact created successfully", contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a contact by ID
exports.deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update an existing contact by ID
// Update an existing contact by ID
exports.updateContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, message, status } = req.body; // Include status in the request body

    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    // Find the contact by ID and update it
    const contact = await Contact.findByIdAndUpdate(
      id,
      { email, message, status }, // Update the status
      { new: true, runValidators: true }, // Return the updated contact and validate
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count total contacts
exports.countContacts = async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.status(200).json({ totalContacts: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search contacts by name or email
exports.searchContacts = async (req, res) => {
  try {
    const { query, referenceId } = req.query;
    if (!query || !referenceId) {
      return res.status(400).json({ error: "Search query and referenceId are required" });
    }

    const regex = new RegExp(query, "i"); // Case-insensitive search
    const contacts = await Contact.find({
      referenceId,
      $or: [{ email: regex }, { message: regex }],
    });

    // If no contacts are found, return a message for the admin instead of an error
    if (contacts.length === 0) {
      return res.status(200).json({
        message: "No contacts found. Please notify the admin for further assistance.",
        contacts: []
      });
    }

    // If contacts are found, return the result
    res.status(200).json({ totalContacts: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
