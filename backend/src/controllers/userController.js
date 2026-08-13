const User = require("../models/User");
const Department = require("../models/Department");

const assignDepartment = async(req,res)=>{
    try{

        const {department} = req.body;

        if(!department){
            return res.status(400).json({
                message:"Department id is required"
            });
        }

        const targetUser = await User.findById(req.params.id);

        if(!targetUser){
            return res.status(404).json({
                message:"User not found"
            });
        }

        if(!["faculty","student"].includes(targetUser.role)){
            return res.status(400).json({
                message:"Department can only be assigned to faculty or student"
            });
        }

         const existingDepartment = await Department.findById(department);

        if (!existingDepartment) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        targetUser.department = department;
        await targetUser.save();

        const updatedUser = await User.findById(targetUser._id)
            .select("-password")
            .populate("department");

        res.status(200).json({
            message: "Department assigned successfully",
            user: updatedUser
        });
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getMyProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("department");
        
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            user
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports = { assignDepartment, getMyProfile};
