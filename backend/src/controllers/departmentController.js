const Department = require("../models/Department");

const createDepartment = async(req,res) => {
    try{
        const {name,code}=req.body;

        const newDepartment = await Department.create({
            name,
            code
        });

        res.status(201).json({

            message:"Department created successfully",
            department: newDepartment
        });


    }catch(error) {

        res.status(500).json({

            message:error.message

        });
    }
};

const getDepartments = async(req,res) => {

    try{
        const departments = await Department.find();
        res.status(200).json({
            message: "Departments retrieved successfully",
            departments: departments
        });
    }catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {createDepartment, getDepartments};