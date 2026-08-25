const Attendance = require("../models/Attendance");
const User=require("../models/User");
const Subject=require("../models/Subject");
const Department=require("../models/Department");

const markAttendance=async(req,res)=>{

    try{
        const{student,subject,date,status}=req.body;

        const studentUser=await User.findById(student);

        if(!studentUser){
            return res.status(404).json({
                message:"Student not found"
            });
        }

        if(studentUser.role!=="student"){
            return res.status(400).json({
                message:"User is not a student"
            });
        }

        const subjectData=await Subject.findById(subject);

        if(!subjectData){
            return res.status(404).json({
                message:"Subject not found"
            });
        }

        const facultyUser=await User.findById(req.user.id);

        if(!facultyUser){
            return res.status(404).json({
                message:"Faculty not found"
            });
        }

        if(facultyUser.role!=="faculty"){
            return res.status(400).json({
                message:"Only faculty can mark the attendance"
            });
        }

        if(!facultyUser.department||!studentUser.department){
            return res.status(400).json({
                message:"Faculty and student must have a department assigned"
            });
        }

        if(facultyUser.department.toString()!==studentUser.department.toString()){
            return res.status(403).json({
                message:"Faculty and student must belong to the same department"
            });
        }

        const subjectBelongsToDepartment=await subjectData.departments.some(
            departmentId=>
                departmentId.toString()===facultyUser.department.toString()
        );

        if(!subjectBelongsToDepartment){
            return res.status(403).json({
                message:"Subject doesn't belong to any department"
            });
        }

        const existingAttendance=await Attendance.findOne({
            student,subject,date
        });

        if(existingAttendance){
            return res.status(400).json({
                message:"Attendance is already marked for this student on this date"
            });
        }

        const attendance=await Attendance.create({
            student,
            subject,
            faculty:req.user.id,
            date,
            status
        });

        res.status(201).json({
            message:"Attendance marked successfully",
            attendance
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};