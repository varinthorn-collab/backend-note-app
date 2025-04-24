import express from "express"
import {Note} from "../../../models/Note.js"

const router = express.Router()

//GET all notes
router.get("/notes", async (req, res) => {
    try {
       const notes = await Note.find().sort({createdAt: -1, isPinned: -1})
       res.json(notes)
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "failed to fetch notes",
            details: err.message,
        });
    }
});

//Create a note
router.post("/notes", async (req,res) => {
    const {
        title,
        content,
        tags = [],
        isPinned = false,
        userId
    } = req.body
    try{
        const note = await Note.create({
            title,
            content,
            tags,
            isPinned,
            userId
        })
        res.status(201).json(note)
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Failed to create note",
            details: err.message,
        })
    }
});

export default router;