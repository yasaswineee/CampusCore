const express=require("express");
const router=express.Router();

const{markAttendance, getMyAttendance, getFacultyAttendance, getHodAttendance, getAdminAttendance,getAttendanceSummary,
    getSubjectAttendanceSummary,getLowAttendance,getHodAttendanceSummary,getHodLowAttendanceStudents,
    getAdminAttendanceSummary,getAdminDepartmentSummary
}=require("../controllers/attendanceController");

const{protect, authorize}=require("../middlewares/authMiddleware")

router.post("/",protect,authorize("faculty"),markAttendance);
router.get("/faculty",protect,authorize("faculty"),getFacultyAttendance);

router.get("/my",protect,authorize("student"),getMyAttendance);
router.get("/student/summary",protect,authorize("student"),getAttendanceSummary);
router.get("/student/subjects",protect,authorize("student"),getSubjectAttendanceSummary);
router.get("/student/low-attendance",protect,authorize("student"),getLowAttendance);

router.get("/hod",protect,authorize("hod"),getHodAttendance);
router.get("/hod/summary",protect,authorize("hod"),getHodAttendanceSummary);
router.get("/hod/low-attendance",protect,authorize("hod"),getHodLowAttendanceStudents);

router.get("/admin",protect,authorize("admin"),getAdminAttendance);
router.get("/admin/summary",protect,authorize("admin"),getAdminAttendanceSummary);
router.get("/admin/departments",protect,authorize("admin"),getAdminDepartmentSummary);


module.exports=router;