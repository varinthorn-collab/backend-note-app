import {User} from "../../../../models/User.js";

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

//PUT:  Update a user controller
export const updateUser = async (req,res) => {
    try{
        const updatedUser  = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
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