const mongoose=require("mongoose");

const attendanceSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },

    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },

    subject:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Subject"
    },

    date:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        required:true,
        enum:["present","absent"]
    }


});

module.exports= mongoose.model("Attendance",attendanceSchema);