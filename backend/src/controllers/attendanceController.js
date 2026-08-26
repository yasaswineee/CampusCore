const Attendance = require("../models/Attendance");
const User=require("../models/User");
const Subject=require("../models/Subject");


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

const getMyAttendance=async(req,res)=>{

    try{

        const {subject, status, date}=req.query;

        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;
        const skip=(page-1)*limit;

        const filter={student:req.user.id};

        if(subject){
            filter.subject=subject
        }

        if(status){
            filter.status=status
        }

        if(date){
            filter.date=date
        }

        const attendance=await Attendance.find(filter
        )
        .populate("subject","name code")
        .populate("faculty","name email")
        .sort({date: -1})
        .skip(skip)
        .limit(limit);

        const total=await countDocuments(filter);

        res.status(200).json({
            message:"Attendance retrieved successfully",
            count:attendance.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            limit,
            attendance
        });
    }catch(error){
        console.error(error)

        res.status(500).json({
            message:error.message
        });
    }
};

const getFacultyAttendance=async(req,res)=>{
     try {
        const { subject, student, status, date } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {
            faculty: req.user.id
        };

        if (subject) {
            filter.subject = subject;
        }

        if (student) {
            filter.student = student;
        }

        if (status) {
            filter.status = status;
        }

        if (date) {
            filter.date = date;
        }

        const attendance = await Attendance.find(filter)
            .populate("student", "name email")
            .populate("subject", "name code")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            message: "Faculty attendance retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            limit,
            attendance
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getHodAttendance=async(req,res)=>{
    try{
        const { subject, student, status, date } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const hod = await User.findById(req.user.id);

        if(!hod){
            return res.status(404).json({
                message:"Hod not found"
            });
        }

        if(hod.role!="hod"){
            return res.status(403).json({
                message:"Only hod has access to this resource"
            });
        }

        if(!hod.department){
            return res.status(400).json({
                message:"Hod doesn't have a department assigned"
            });
        }

        const students=await User.finf({
            role:"student",
            department:hod.department
        }).select("_id");

        const studentIds=students.map(student.student._id);

        const filter={
            student:{$in:studentIds}
        }

        if (subject) {
            filter.subject = subject;
        }

        if (student) {
            filter.student = student;
        }

        if (status) {
            filter.status = status;
        }

        if (date) {
            filter.date = date;
        }

          const attendance = await Attendance.find(filter)
            .populate("student", "name email")
            .populate("faculty", "name email")
            .populate("subject", "name code")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            message:"HOD attendance retrieved successfully",
            currentPage:page,
            totalPages:Math.ceil(page/limit),
            totalItems:totsl,
            limit,
            attendance
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            message:error.message
        });
    }
};

const getAdminAttendance=async(req,res)=>{
    try{
        const{student,faculty,subject,status,date}=req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {};

        if (student) {
            filter.student = student;
        }

        if (faculty) {
            filter.faculty = faculty;
        }

        if (subject) {
            filter.subject = subject;
        }

        if (status) {
            filter.status = status;
        }

        if (date) {
            filter.date = date;
        }

         const attendance = await Attendance.find(filter)
            .populate("student", "name email")
            .populate("faculty", "name email")
            .populate("subject", "name code")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            message: "Admin attendance retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            limit,
            attendance
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            message:error.message
        });
    }
};

const getAttendanceSummary=async(req,res)=>{
    try{
        const attendance=await Attendance.find({
            student:req.user.id
        });

        const totalClasses=attendance.length;
        const present=attendance.filter(
            record=>record.status==="present"
        ).length;
        const absent=attendance.filter(
            record=>record.status==="absent"
        ).length;
        const percentage= totalClasses===0?0:Number(
            ((present/totalClasses)*100).toFixed(2)
        );

        res.status(200).json({
            message:"Attendance summary retrieved successfully",
            overall:{
                totalClasses,present,absent,percentage
            }
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            message:error.message
        });
    }
};

const getSubjectAttendanceSummary=async(req,res)=>{
    try{
        const attendance=await Attendance.find({
            student:req.user.id
         }).populate("subject","name code");
        
         const subjectSummary={};

         attendance.forEach(record=>{
            const subjectId=record.subject._id.toString();

            if(!subjectSummary[subjectId]){
                subjectSummary[subjectId]={
                    subject:record.subject,
                    totlClasses:0,
                    present:0,
                    absent:0
                };
            }
            subjectSummary[subjectId].totalClasses++;

            if(record.status==="present"){
                subjectSummary[subjectId].present++;
            }else if(record.status==="absent"){
                subjectSummary[subjectId].absent++;
            }
         });

         const subjects=Object.values(subjectSummary).map(item=>({
            ...item,
            percentage:
                item.totalClasses==0?0:Number(
                    (
                        (item.present/item.totalClasses)*100
                    ).toFixed(2)
                )
         }));

         res.status(200).json({
            message:"Subject wise attendance retrieved successfully",
            subjects
         });

    }catch(error){
        console.log(error)

        res.status(500).json({
            message:error.message
        });
    }
};

module.exports = { markAttendance, getMyAttendance, getFacultyAttendance, getHodAttendance, getAdminAttendance,getAttendanceSummary,getSubjectAttendanceSummary};