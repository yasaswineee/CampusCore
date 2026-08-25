const express = require("express");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app=express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("CampusCore is running");
})

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects",subjectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

module.exports=app;