const express = require("express");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");


const app=express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("CampusCore is running");
})

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);

module.exports=app;