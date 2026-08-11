const Subject=require("../models/Subject");

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
            })
        }

        res.status(200).json({
            message:"Subject retrieved successfully",
            subject:subject
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
};

const updateSubject=async(req,res)=>{
    
    try{

        const {name,code,departments}=req.body;

        const subject = await Subject.findByIdAndUpdate(
            req.params.id,{
                name,
                code,
                departments
            },
            {new:true}
        );

        if(!subject){
            return res.status(404).json({
                message:"Subject not found"
            });
        }

        res.status(200).json({
            message:"Subject updated successfully",
            subject:subject
        });
    }catch(error){
        res.status(500).json({
            message:error.message
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
