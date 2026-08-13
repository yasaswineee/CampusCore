const Subject=require("../models/Subject");
const Department = require("../models/Department");

const createSubject=async(req,res)=>{
    try{
        const {name,code,departments}=req.body;

        const subject=await Subject.create({
            name,code,departments
        });

        res.status(201).json({
            message:"Subject created successfully",
            subject:subject
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const getSubjects=async(req,res)=>{

    try{
        const subjects=await Subject.find().populate("departments");

        res.status(200).json({
            message:"Subjects retrieved successfully",
            subjects:subjects
        });
    }catch(error){

        res.status(500).json({
            message:error.message
        });
    }
};

const getSubjectById=async(req,res)=>{
    try{
        const subject=await Subject.findById(req.params.id).populate("departments");

        if(!subject){
            return res.status(404).json({
                message:"Subject not found"
            });
        }

        res.status(200).json({
            message:"Subject retrieved successfully",
            subject:subject
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { name, code, departments } = req.body;

        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        if (req.user.role === "hod") {
            const hodDepartment = await Department.findOne({
                hod: req.user.id
            });

            if (!hodDepartment) {
                return res.status(403).json({
                    message: "HOD is not assigned to any department"
                });
            }

            const belongsToDepartment = subject.departments.some(
                departmentId =>
                    departmentId.toString() === hodDepartment._id.toString()
            );

            if (!belongsToDepartment) {
                return res.status(403).json({
                    message: "You can only update subjects belonging to your department"
                });
            }

            const invalidDepartment = departments.some(
                departmentId =>
                    departmentId.toString() !== hodDepartment._id.toString()
            );

            if (invalidDepartment) {
                return res.status(403).json({
                    message: "You can only assign subjects to your department"
                });
            }
        }

        subject.name = name;
        subject.code = code;
        subject.departments = departments;

        await subject.save();

        res.status(200).json({
            message: "Subject updated successfully",
            subject
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteSubject = async (req,res)=>{
    try{
        const subject = await Subject.findByIdAndDelete(req.params.id);

        if(!subject){
            return res.status(404).json({
                message:"Subject not found"
            });
        }

        res.status(200).json({
            message:"Subject deleted successfully"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
    
};


module.exports={createSubject, getSubjects, getSubjectById,updateSubject, deleteSubject};
