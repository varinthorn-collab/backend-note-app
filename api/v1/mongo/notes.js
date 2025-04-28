import express from "express"
import {Note} from "../../../models/Note.js"
import { getAllNotes, createNote,searchNote,getNoteById } from "./controllers/notesController.js"
import {authUser} from "../../v1/middleware/auth.js"

const router = express.Router()

//Get all notes
router.get("/notes", getAllNotes);

//Create a note
router.post("/notes", createNote);

//Add note
router.post("/add-note", authUser, async (req, res) => { 
    const {title, content, tags = [], isPinned = false} = req.body;
    const { user } = req.user
    if (!title || !content) {
        res.status(400).json({
            error: true,
            message: "All fields required!"
        })
    }

    if (!user || !user._id) {
        res.status(400).json({
            error: true,
            message: "Invalid user credentials"
        })
    }

    try {
        const note = await Note.create({
            title,
            content,
            tags,
            isPinned,
            userId: user._id,
        })

        await note.save()
        res.json({
            error: false,
            note,
            message: "Note added successfully",
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }

 });

//Edit note (unfinished)
router.put("/edit-note/:noteId", (first) => { second });

//Update isPinned (unfinished)
router.put("/update-note-pinned/:noteId", (first) => { second });


//Get Notes by user id
router.get("/get-notes-by-id", authUser, getNoteById);


//Delete note (unfinished)
router.delete("/delete-note/:noteId", (first) => { second });


//Search notes
router.get("/search-notes", authUser, searchNote);


export default router;