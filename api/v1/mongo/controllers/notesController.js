import {Note} from "../../../../models/Note.js";

//GET all notes controller
export const getAllNotes = async (req, res) => {
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
}

//POST create notes controller
export const createNote = async (req,res) => {
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
}

//GET get notes by id
export const getNoteById = async (req, res) => { 
    const {user} = req.user
    try {
        const notes = await Note.find({userId: user._id}).sort({isPinned:-1})
        res.json ({
            error: false,
            notes,
            message: "All notes retrieved",
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
 }

//GET Search Note Controller
export const searchNote = async (req,res) => { 
    const {user} = req.user;
    const {query} = req.query;

if(!query) {
    res.status(400).json({error: true, message: "Search query is required"})
}
try {
    const matchingNotes = await Note.find({
        userId: user._id,
        $or: [
            {title:{$regex: new RegExp(query, "i")}}, 
            {content: {$regex: new RegExp(query, "i")}}
        ]
    })

    res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes matching the search query retrieved success",

    })
} catch (err) {
    res.status(500).json({
        error: true,
        message: "Internal Server Error",
    })
}

}