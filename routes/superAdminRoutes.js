const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const auth = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleWare");

// Protected route for only superadmin
router.use(auth);
router.use(superAdminMiddleware);

// Create new admin
router.post("/create-admin", superAdminController.createAdminUser);

module.exports = router;
