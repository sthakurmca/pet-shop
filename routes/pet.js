const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { authenticate, authorize, optionalAuth } = require("../middlewares/auth");

router.get("/", optionalAuth, petController.list);
router.get("/filters", petController.getSpeciesAndBreeds);
router.get("/:id", petController.getOne);

router.post("/", authenticate, authorize("admin"), petController.create);
router.put("/:id", authenticate, authorize("admin"), petController.update);
router.delete("/:id", authenticate, authorize("admin"), petController.remove);

module.exports = router;
