const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.USER_KEY || process.env.JWT_SECRET || "pet-adoption-secret";

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated." });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (user) req.user = user;
  } catch (_) {}
  next();
};
