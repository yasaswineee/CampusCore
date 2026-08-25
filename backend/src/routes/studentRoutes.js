const express = require("express");

const router = express.Router();

const { getMySubjects } = require("../controllers/studentController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/me/subjects",
    protect,
    authorize("student"),
    getMySubjects
);

module.exports = router;