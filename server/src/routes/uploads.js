const express = require("express");
const upload = require("../utils/upload");
const uploadsController = require("../controllers/uploadsController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", upload.single("file"), uploadsController.handleUpload);
router.delete("/:id", uploadsController.handleDelete);

module.exports = router;
