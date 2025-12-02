const express = require("express");
const postsController = require("../controllers/postsController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", postsController.list);
router.get("/:id", postsController.get);
router.post("/", postsController.create);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.remove);

module.exports = router;
