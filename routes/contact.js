const router = require("express").Router();
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
    // Create a new contact document using the Contact model
    const newContact = new Contact({
      fullName,
      email,
      phone,
      gender,
    });

    // Save the new contact
    const savedContact = await newContact.save();

    return res.status(200).json({ message: "Contact created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
