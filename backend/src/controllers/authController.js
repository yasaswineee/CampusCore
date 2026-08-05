const bcrypt = require("bcrypt");
const User= require("../models/User");

const register = async(req,res) =>{
   try{
     const {name, email, password, role} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = await User.create({name, email, password, role});

    res.status(201).json({
        message: "User registered succesfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    })
   } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
    }

    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { register,login};