const Pet = require("../models/Pet");

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const species = (req.query.species || "").trim();
    const breed = (req.query.breed || "").trim();
    const ageMin = req.query.ageMin !== undefined && req.query.ageMin !== "" ? Number(req.query.ageMin) : null;
    const ageMax = req.query.ageMax !== undefined && req.query.ageMax !== "" ? Number(req.query.ageMax) : null;
    let statusFilter = (req.query.status || "available").trim();
    if (statusFilter === "all" && req.user?.role !== "admin") statusFilter = "available";
    const filter = {};
    if (statusFilter !== "all") filter.status = statusFilter || "available";
    if (species) filter.species = new RegExp(species, "i");
    if (breed) filter.breed = new RegExp(breed, "i");
    if (ageMin != null || ageMax != null) {
      filter.age = {};
      if (ageMin != null) filter.age.$gte = ageMin;
      if (ageMax != null) filter.age.$lte = ageMax;
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { breed: new RegExp(search, "i") },
        { species: new RegExp(search, "i") },
      ];
    }

    const [pets, total] = await Promise.all([
      Pet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Pet.countDocuments(filter),
    ]);

    res.json({
      pets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to list pets." });
  }
};

exports.getOne = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).lean();
    if (!pet) return res.status(404).json({ message: "Pet not found." });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get pet." });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, species, breed, age, description, imageUrl, status } = req.body;
    if (!name || !species || age === undefined) {
      return res.status(400).json({ message: "Name, species and age are required." });
    }
    const pet = await Pet.create({
      name,
      species,
      breed: breed || "",
      age: Number(age),
      description: description || "",
      imageUrl: imageUrl || "",
      status: status || "available",
    });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create pet." });
  }
};

exports.update = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found." });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update pet." });
  }
};

exports.remove = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found." });
    res.json({ message: "Pet deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete pet." });
  }
};

exports.getSpeciesAndBreeds = async (req, res) => {
  try {
    const species = await Pet.distinct("species");
    const breeds = await Pet.distinct("breed").then((b) => b.filter(Boolean));
    res.json({ species, breeds });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get filters." });
  }
};
