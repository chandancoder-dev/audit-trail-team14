const jwt = require("jsonwebtoken");

const tokenVerification = (req , res , next)=>{
     
    console.log(req.headers.authorization);
    if(req.headers.authorization 
        && req.headers.authorization.startsWith("Bearer")
    )
    {
        try{
            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, process.env.SECRET_KEY);
            req.id = data.id;
            next();
        }
        catch(e){
            return res.status(401).json({
              message: "Not authorized, invalid token",
         });
        }
        
    }
    else{
        
        return res.status(401).json({message : "Not authorized, no token"});
    }
}

module.exports = tokenVerification;