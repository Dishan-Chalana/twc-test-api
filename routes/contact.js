const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Contact = require("../models/Contact");

router.post("/new/contact", async (req, res) => {
  const { fullName, email, phone, gender } = req.body;

  // Check if all required fields are provided
  if (!fullName || !email || !phone || !gender) {
    return res
      .status(400)
      .json({ error: "Please complete all required fields." });
  }

  try {
    // Retrieve the logged-in user's ID from req.user
    //const userId = req.user.userId;

    // Create a new contact document using the Contact model
    const newContact = new Contact({
      fullName,
      email,
      phone,
      gender,
      //userId, // Associate the user ID with the contact
    });

    // Save the new contact
    const savedContact = await newContact.save();

    return res.status(200).json({ message: "Contact created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Get all contacts
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete a contact
router.delete("/delete/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json({ message: "Contact deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Update a contact
router.put("/update/contact/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Please provide a contact id." });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid contact id." });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json({ message: "Contact updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});




module.exports = router;
