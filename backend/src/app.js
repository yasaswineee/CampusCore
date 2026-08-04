const express = require("express");

const app=express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("CampusCore is running");
})

module.exports=app;

