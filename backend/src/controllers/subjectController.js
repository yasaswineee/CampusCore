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
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const search=req.query.search || "";
        const skip=(page - 1)*limit;

        const filter=search
        ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { code: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const total=await Department.countDocuments(filter);

        const departments = await Department.find(filter)
            .populate("hod")
            .skip(skip)
            .limit(limit);

            res.status(200).json({
            message: "Departments retrieved successfully",
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            },
            departments
        });


    }catch(error){
        res.status(500).json({
            error:error.message
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
