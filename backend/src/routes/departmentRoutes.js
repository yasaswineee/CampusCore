const express = require("express");
const router = express.Router();
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment} = require("../controllers/departmentController");
const {protect} =require("../middlewares/authMiddleware");


router.post("/", createDepartment);
router.get("/",protect, getDepartments);
router.get("/:id",getDepartmentById);
router.put("/:id",updateDepartment);
router.delete("/:id",deleteDepartment);


module.exports = router;
