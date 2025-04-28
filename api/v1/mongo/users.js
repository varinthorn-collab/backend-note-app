import express from "express";
import { User } from "../../../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import { getAllUsers, createUser, updateUser, RegisterUser, loginUser, deleteUser } from "./controllers/usersController.js"
const router = express.Router()

//GET : get all users
router.get("/users", getAllUsers);

//POST:  Create a user
router.post("/users", createUser)

//PUT:  Update a user
router.put("/users/:id", updateUser)

//POST: Register a new user
router.post("/auth/register", RegisterUser)

//POST: Login a user
router.post("/auth/login", loginUser)

//DELETE: delete user
router.delete("/users/:id", deleteUser);

export default router;