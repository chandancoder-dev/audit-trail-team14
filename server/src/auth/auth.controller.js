const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const register = async(req ,res) =>{
    const {name , username , email , password} = req.body;
    try{
        // Input validation
        if(!name || !username || !email || !password){
            return res.status(400).json({message : "name, username, email and password are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "password must be at least 6 characters"});
        }

        const userExist = await User.findOne({email : email});

       if(userExist){
           return res.status(409).json({message : "user already exist."});
       }
       const hashedPassword = await bcrypt.hash(password,10);
    
       const user = await User.create(
        {
            name : name,
            username : username,
            email : email,
            password : hashedPassword
        }
       );

        res.status(201).json({
        message: "User registered successfully",
        });
    }
    catch(e){
      // Unique-index race: duplicate email
      if(e && e.code === 11000){
        return res.status(409).json({message : "user already exist."});
      }
      res.status(500).json({message : e.message});

    }
}

const login = async(req , res) =>{

    const {email , password} = req.body;

    try{

        const user = await User.findOne({email : email});

        if(!user){
            return res.status(404).json({message : "user does not exist."});
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match){

            return res.status(401).json({message : "password does not match."});
        }
        
        const token = jwt.sign(
         { id: user._id },
           process.env.JWT_SECRET,
         {
          expiresIn: "1d",
        }
       );

       return res.status(200).json({message : "login successfull", token : token})

    }
    catch(e){
       return res.status(500).json({message : e.message});
    }
}
const resetPassword = async(req, res) =>{
    const {email , currentPassword, password} = req.body;

    try{
        if(!email || !currentPassword || !password){
            return res.status(400).json({message : "email, currentPassword and password are required"});
        }

        const user = await User.findOne({email : email});

        // Generic message for both unknown email and wrong password to avoid
        // leaking which emails are registered (user enumeration).
        if(!user){
            return res.status(401).json({message : "Invalid email or current password"});
        }

        // Verify identity: the caller must know the current password.
        const match = await bcrypt.compare(currentPassword, user.password);

        if(!match){
            return res.status(401).json({message : "Invalid email or current password"});
        }

        const passwordHash = await bcrypt.hash(password,10);

        user.password = passwordHash;

        await user.save();

        return res.status(200).json({message : "password reset successfully"});

    }
    catch(e){
         res.status(500).json({message : e.message});
    }
}
const getCurrentUser = async(req , res) =>{
       
    try{
        const id = req.id;
        const user = await User.findById(id).select("-password");
        if (!user) {
           return res.status(404).json({
           message: "User not found",
      });
    }
      return res.status(200).json(user);
    }
    catch(e){
        res.status(500).json({message : e.message});
    }
}
module.exports = {register,login, getCurrentUser, resetPassword};