import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import argon2 from "argon2"
import User from "../models/user.js";

import dotenv from "dotenv"


const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY

// @description Register user
// @route auth/register
// @access public
const register = asyncHandler(async (req,res) =>{
    console.log(req.body)
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    if(!userEmail || !userPassword){
        res.status(403).json({"message": "email or password not found"})
        return;
    }

    const userExists = await User.findOne({where:{email:userEmail}})
    if(userExists){
        res.status(400).json({"message": "User already exists try login instead of resgister"})
        return;
    }

    if(userExists){
        res.status(400).json({"message": "User already exists try login instead of resgister"})
        return;
    }
      

    const hashedPassword = await argon2.hash(userPassword)
    const user = await User.create({email:userEmail, password:hashedPassword})


    const accessToken = jwt.sign({
        user:{email:userEmail}
    }, secretKey, {expiresIn: '8h'})

    res.status(201).json({"message": "User successfully resgistered!", "accessToken":accessToken})
    return;
})

// @description Login user
// @route auth/login
// @access public
const login = asyncHandler(async (req,res) =>{
    const userEmail = req.body.email;
    const userPassword = req.body.password
    if(!userEmail || !userPassword){
        res.status(403).json({"message": "email or password not found"})
        return;
    }

    const userExists = await User.findOne({where:{email:userEmail}})
    if(!userExists){
        res.status(403).json({"message": "User with the given email does not exists"})
        return;
    }

    const accessToken = jwt.sign({
        user:{email:userEmail}
    }, secretKey, {expiresIn: '8h'})

    const passwordMatch = await argon2.verify(userExists.password, userPassword)
    if(passwordMatch){
        res.status(201).json({"message": "User successfully loggedin!", "accessToken":accessToken});
        return;
    }
    else{
        res.status(403).json({ "Message": "Password is wrong, please enter correct password" });
        return;
    }
    
})


export {register, login};

