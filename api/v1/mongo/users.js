import express from "express";
import { User } from "../../../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import { getAllUsers, createUser, updateUser } from "./controllers/usersController.js"
const router = express.Router()

//GET : get all users
router.get("/users", getAllUsers);

//POST:  Create a user
router.post("/users", createUser)

//PUT:  Update a user

router.put("/users/:id", updateUser)

//Register a new user
router.post("/auth/register", async (req,res) => { 
    const {username, fullName, email, password} = req.body
    if (!username|| !fullName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        })
    }
    try {
        const existingUser = await User.findOne({email})
        if(existingUser) { 
            res.status(409).json({error: true, message: "Email already in use."})
        }

        const user = new User({username, fullName, email, password}) 
        await user.save();
        res.status(201).json({
            error: false,
            message: "user register successful"
        })

    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Server error",
            details: err.message,
        })
    }
 })

//Login a user

router.post("/auth/login", async (req, res) => {
    const {email, password} = req.body
    if(!email||!password) {
        return res.status(400).json({
            error: true,
            message: "Email and password are required."
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            res.status(401).json({
                error: true,
                message:"invalid credentials",
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(401).json({
                error: true,
                message:"invalid credentials",
            });
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h",});
        //jwt.sign is to access jwt secret to verify whether token is correct and available. Token is like a user card that represent user and contain user info. The last parameters is to make token expired 1 hr (otherwise the token will be remembered in local storage and anyone can log in with this device in anytime). This makes the web log out in 1 hr after used which making it more secure.

        res.json({
            error: false,
            token,
            message: "Login Successful"
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Server error",
            details: err.message,
        })
    }
})  

export default router;