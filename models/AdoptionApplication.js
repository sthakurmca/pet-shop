const mongoose = require("mongoose");

const adoptionApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    message: { type: String, trim: true },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

adoptionApplicationSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model("AdoptionApplication", adoptionApplicationSchema);
