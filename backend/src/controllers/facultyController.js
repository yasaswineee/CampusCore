const User = require("../models/User");
const Subject = require("../models/Subject");

const getMySubjects = async (req, res) => {
    try {
        const faculty = await User.findById(req.user.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        if (faculty.role !== "faculty") {
            return res.status(403).json({
                message: "Only faculty can access this resource"
            });
        }

        if (!faculty.department) {
            return res.status(400).json({
                message: "Faculty is not assigned to any department"
            });
        }

        const subjects = await Subject.find({
            departments: faculty.department
        }).populate("departments");

        res.status(200).json({
            message: "Faculty subjects retrieved successfully",
            subjects
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getMySubjects };