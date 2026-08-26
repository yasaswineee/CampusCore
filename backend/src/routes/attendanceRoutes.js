const express=require("express");
const router=express.Router();

const{markAttendance, getMyAttendance, getFacultyAttendance, getHodAttendance, getAdminAttendance,getAttendanceSummary,
    getSubjectAttendanceSummary
}=require("../controllers/attendanceController");
const{protect, authorize}=require("../middlewares/authMiddleware")

router.post("/",protect,authorize("faculty"),markAttendance);
router.get("/my",protect,authorize("student"),getMyAttendance);
router.get("/faculty",protect,authorize("faculty"),getFacultyAttendance);
router.get("/hod",protect,authorize("hod"),getHodAttendance);
router.get("/admin",protect,authorize("admin"),getAdminAttendance);
router.get("/student",protect,authorize("student"),getAttendanceSummary);
router.get("/student",protect,authorize("student"),getSubjectAttendanceSummary);
module.exports=router;