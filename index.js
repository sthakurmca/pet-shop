const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const fs = require("fs");
const https = require("https");
const path = require("path");
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
env.config(".env");

// Connect to DB
require("./config/db");

// --- SETTINGS ---
const port = 8000;

// ⚠️ Set this to false because NGINX handles HTTPS
const httpsStatus = false;

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Serve uploads and React build
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "uploads", "web")));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pets", require("./routes/pet"));
app.use("/api/adoptions", require("./routes/adoption"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
