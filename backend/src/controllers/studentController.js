const User = require("../models/User");
const Subject = require("../models/Subject");

const getMySubjects = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.role !== "student") {
            return res.status(403).json({
                message: "Only students can access this resource"
            });
        }

        if (!student.department) {
            return res.status(400).json({
                message: "Student is not assigned to any department"
            });
        }

        const subjects = await Subject.find({
            departments: student.department
        }).populate("departments");

        res.status(200).json({
            message: "Student subjects retrieved successfully",
            subjects
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getMySubjects };