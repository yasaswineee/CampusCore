const express = require("express");
const router = express.Router();
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment} = require("../controllers/departmentController");
const {protect, authorize} =require("../middlewares/authMiddleware");


router.post("/", createDepartment);
router.get("/",protect, getDepartments);
router.get("/:id",getDepartmentById);
router.put("/:id",updateDepartment);
router.delete("/:id",deleteDepartment);
router.post("/",protect,authorize("admin"),createDepartment);


module.exports = router;
