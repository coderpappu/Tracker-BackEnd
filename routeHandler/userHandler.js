const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = new mongoose.model("User", userSchema);

//SINGUP
router.post("/signup", async (req, res) => {
    try{
        const heasedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            name : req.body.name,
            username : req.body.username, 
            password : heasedPassword
        });
        await newUser.save();
        res.status(200).json("Signup was successful!");
    }catch{
        res.status(500).json("Signup failed!");
    }

});

// LOGIN
router.post("/login", async(req,res)=>{

    try{
        const user = await User.find({username : req.body.username});

        if(user && user.length > 0){
            // password validation 
            const isValidPassword = await bcrypt.compare(req.body.password,user[0].password);

            if(isValidPassword){
                // token generate 
                const token = jwt.sign({username : user[0].username,userId : user[0]._id}, process.env.JWT_SECRET, {expiresIn : "1h"});

                res.status(200).json({
                    "access_token" : token,
                    "message" : "Login Successful!"
                })

            }else{
                res.status(401).json({
                    "error" : "Authetication failed!"
                })
            }
        }else{
            res.status(401).json({
                "error" : "Authetication failed!"
            })
        }
    }catch{
        res.status(401).json({
            "error" : "Authetication failed!"
        });
    }
})

router.get('/all', async(req, res) =>{
    try{
        const users = await User.find({}).populate('todos');

        res.status(200).json({
            data:users,
            message : "Success"
        })
    }catch{
        res.status(500).json({
            
            message : "There was an error on the server site!"
        })
    }
})


module.exports = router;
