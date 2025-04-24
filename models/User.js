import { Schema, model } from "mongoose";

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
    createdOn: {type: Date, default: new Date().getTime()},
})

//Use schema to create model
//Mongoose will use model name User and name our collection as users automatically 
export const User = model("User", UserSchema)
