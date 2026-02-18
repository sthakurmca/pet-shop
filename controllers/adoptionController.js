const AdoptionApplication = require("../models/AdoptionApplication");
const Pet = require("../models/Pet");

exports.apply = async (req, res) => {
  try {
    const userId = req.user._id;
    const { petId, message } = req.body;
    if (!petId) return res.status(400).json({ message: "Pet ID is required." });

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found." });
    if (pet.status !== "available") {
      return res.status(400).json({ message: "This pet is not available for adoption." });
    }

    const existing = await AdoptionApplication.findOne({ user: userId, pet: petId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for this pet." });
    }

    const application = await AdoptionApplication.create({
      user: userId,
      pet: petId,
      message: message || "",
    });
    const populated = await AdoptionApplication.findById(application._id)
      .populate("pet", "name species breed age status")
      .populate("user", "name email")
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to submit application." });
  }
};

exports.myApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ user: req.user._id })
      .populate("pet", "name species breed age status imageUrl")
      .sort({ createdAt: -1 })
      .lean();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get applications." });
  }
};

exports.allApplications = async (req, res) => {
  try {
    const statusFilter = (req.query.status || "").trim();
    const filter = statusFilter ? { status: statusFilter } : {};
    const applications = await AdoptionApplication.find(filter)
      .populate("pet", "name species breed age status")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get applications." });
  }
};

exports.review = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    const application = await AdoptionApplication.findById(id).populate("pet");
    if (!application) return res.status(404).json({ message: "Application not found." });
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already reviewed." });
    }

    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user._id;
    await application.save();

    const newPetStatus = status === "approved" ? "adopted" : "available";
    await Pet.findByIdAndUpdate(application.pet._id, { status: newPetStatus });

    const populated = await AdoptionApplication.findById(application._id)
      .populate("pet", "name species breed age status")
      .populate("user", "name email")
      .lean();
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to review application." });
  }
};
