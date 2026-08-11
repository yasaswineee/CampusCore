const express = require("express");
const router = express.Router();

const {createSubject,getSubjects, getSubjectById, updateSubject, deleteSubject}=require("../controllers/subjectController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/",protect,authorize("admin"),createSubject);
router.get("/",protect,authorize("admin","hod","faculty","student"),getSubjects);
router.get("/:id",protect,authorize("admin","hod","faculty","student"),getSubjectById);
router.put("/:id",protect,authorize("admin","hod"),updateSubject);
router.delete("/:id",protect,authorize("admin"),deleteSubject);

module.exports=router;