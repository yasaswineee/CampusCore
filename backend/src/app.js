const express = require("express");
const authRoutes = require("./routes/authRoutes");


const app=express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("CampusCore is running");
})

module.exports=app;

app.use("/api/auth", authRoutes);
