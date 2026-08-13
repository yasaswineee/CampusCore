const express = require("express");

const router = express.Router();

const { assignDepartment, getMyProfile} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");


router.get("/me", protect, getMyProfile);

router.put(
    "/:id/department",
    protect,
    authorize("admin"),
    assignDepartment
);

module.exports = router;