const bcrypt = require("bcrypt");
const User= require("../models/User");
const jwt=require("jsonwebtoken");

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
        message: "User registered successfully",
        user: {
            id: newUser._id,    
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    })
   } catch (error) {
        console.error(error);
        
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

        const passwordMatch=await bcrypt.compare(password,user.password);

        if(!passwordMatch){
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    }

    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};


const getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            user
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports = { register,login,getMe};