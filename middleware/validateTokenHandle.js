import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const accessToken = process.env.ACCESS_TOKEN_SECRET_KEY

const validateToken = asyncHandler((async(req, res, next) =>{
    let token;
    let authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer ')){
        token = authHeader.split(' ')[1];
        try{
            const decodedToken = jwt.verify(token, accessToken);
            req.user = decodedToken.user; 
            console.log(decodedToken.user);
            console.log("Token validated")
            next()
        }
        catch(error){
            console.log(error)
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
    else{
        res.status(403).json({"message" : "Token not provided"})

    }
}))

export default validateToken