const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, trim: true },
    breed: { type: String, trim: true },
    age: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: ["available", "pending", "adopted"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
