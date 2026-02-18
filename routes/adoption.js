const express = require("express");
const router = express.Router();
const adoptionController = require("../controllers/adoptionController");
const { authenticate, authorize } = require("../middlewares/auth");

router.post("/apply", authenticate, adoptionController.apply);
router.get("/my", authenticate, adoptionController.myApplications);

router.get("/all", authenticate, authorize("admin"), adoptionController.allApplications);
router.put("/:id/review", authenticate, authorize("admin"), adoptionController.review);

module.exports = router;
