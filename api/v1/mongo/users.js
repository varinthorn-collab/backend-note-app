import express from "express";
import { User } from "../../../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import { getAllUsers, getUserById, createUser, updateUser, RegisterUser, loginUser, deleteUser, logoutUser, userInProtectedRoute } from "./controllers/usersController.js"
import {authUser} from "../../v1/middleware/auth.js"

const router = express.Router()

//GET : get all users
router.get("/users", getAllUsers);

//GET : get user by id
router.get("/public-profile/:userId", getUserById);

//POST:  Create a user
router.post("/users", createUser)

//PUT:  Update a user
router.put("/users/:id", updateUser)

//DELETE: delete user
router.delete("/users/:id", deleteUser);

//POST: Register a new user
router.post("/auth/register", RegisterUser)

//POST: Login a user
router.post("/auth/login", loginUser)

//POST: Logout a user
router.post("/auth/logout", logoutUser );

//GET:  user in protected route
router.get("/auth/profile", authUser, userInProtectedRoute)

export default router;