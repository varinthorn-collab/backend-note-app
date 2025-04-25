import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

//Create MongoDB document schema 
const UserSchema = new Schema({
    userId: {type:Number},
    username:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    name: {type: String},
    email: {type: String},
    password: {type: String, required: true},
    createdOn: {type: Date, default: new Date().getTime()},
});

//Hash password before saving
UserSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next(); // check if the password is modified. If it's modified, tell the system to (next) and don't hash/salt the password again
    this.password = await bcrypt.hash(this.password, 10) //this is "salt", to encrypt the password in 10 digits (10 digits is the optimal number considering the resources use and difficulty for intrusion)
    next();
});

//Use schema to create model
//Mongoose will use model name User and name our collection as users automatically 
export const User = model("User", UserSchema)
