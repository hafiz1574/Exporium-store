const express = require("express");
const postsController = require("../controllers/postsController");
const settingsController = require("../controllers/settingsController");

const router = express.Router();

router.get("/posts", postsController.listPublic);
router.get("/settings", settingsController.getPublic);

module.exports = router;
