const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async(req ,res) =>{
    const {name , username , email , password} = req.body;
   
    try{
        const userExist = await User.findOne({email : email});

       if(userExist){
           return res.json({message : "user already exist .......",userExist});
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
        user,
        });
    }
    catch(e){
      res.status(500).json({message : e.message});

    }
}

module.exports = {register};