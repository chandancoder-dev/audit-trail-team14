const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const register = async(req ,res) =>{
    const {name , username , email , password} = req.body;
   
    try{
        const userExist = await User.findOne({email : email});

       if(userExist){
           return res.json({message : "user already exist."});
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
           process.env.SECRET_KEY,
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
module.exports = {register,login};