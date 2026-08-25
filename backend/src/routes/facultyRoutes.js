const express = require("express");
const router = express.Router();
const { getMySubjects } = require("../controllers/facultyController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/me/subjects",
    protect,
    authorize("faculty"),
    getMySubjects
);

module.exports = router;