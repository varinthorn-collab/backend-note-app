import {User} from "../../../../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';

//GET: get all users controller
export const getAllUsers =  async (req, res) => {
    try {
        const users = await User.find();
        res.json({error: false, users});
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch users",
            details: err.message,
        })

    }
}

// GET: get user by id
export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select(
        "-password"//exclude password
      );
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      res.status(200).json({ error: false, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  };


//POST: create a user controller
export const createUser = async (req, res) => {
    const {username,name,email} = req.body
    try {
        //prevent duplicate email
        const existing = await User.findOne({email})
        if(existing) {
            res.status(409).json({
                error:true,
                message: "Email already in use",
            })
        }
        //create and save new user
        const user = new User({username,name,email})
        await user.save();
        res.status(201).json({
            error: false,
            user,
            message: "User created successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Server error",
            details: err.message,
        });
    }
}

//PUT&PATCH:  Update a user controller
export const updateUser = async (req,res) => {
    try{
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser  = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // Return updated doc & validate
        );

        if (!updatedUser) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }
        res.status(200).json({
            error: false,
            user: updatedUser,
            message: "User updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to update user",
            details: err.message,
        });
    }

}

//DELETE delete user
 export const deleteUser = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        res.status(200).json({
            error: false,
            message: "User deleted successfully",
            deletedUser: user
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to fetch user",
            details: err.message
        });
    }
}

//POST:  Register a user controller

export const RegisterUser = async (req,res) => { 
    const {username, name, email, password} = req.body
    if (!username|| !name || !email || !password) {
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

        const user = new User({username, name, email, password}) 
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
 }

//POST Login user controller
 export const loginUser = async (req, res) => {
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
            return res.status(401).json({
                error: true,
                message:"Invalid credentials", 
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                error: true,
                message:"Invalid credentials", 
            });
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h",});
        //jwt.sign is to access jwt secret to verify whether token is correct and available. Token is like a user card that represent user and contain user info. The last parameters is to make token expired 1 hr (otherwise the token will be remembered in local storage and anyone can log in with this device in anytime). This makes the web log out in 1 hr after used which making it more secure.

        // Set the token in an HTTP-only cookie
        res.cookie("accessToken", token, {
           httpOnly: true, //  Makes the cookie inaccessible to client-side JavaScript
           secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
           sameSite: "Strict", // Helps mitigate CSRF attacks. Use 'Lax' if needed for cross-site redirects.
           maxAge: 60 * 60 * 1000 // 1 hour in milliseconds (should match token expiry)
        });

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
 }

//POST Logout user controller


export const logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

// Get protected route user controller
export const userInProtectedRoute = async (req, res) => {
    const user = await User.findById(req.user.user._id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
  
    res.status(200).json({ error: false, user });
  };