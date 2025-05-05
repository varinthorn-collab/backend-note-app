import {Note} from "../../../../models/Note.js";
import mongoose from "mongoose";

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

//POST add note controller
export const addNote = async (req, res) => { 
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

 }

//GET get notes by user id
export const getNoteByUser = async (req, res) => { 
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

//GET get note by note id
export const getNoteById = async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
  
    try {
      // Find the note by ID and ensure it belongs to the logged-in user
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      return res.json({
        error: false,
        note,
        message: "Note retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching note:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  };


//GET get public notes for a user
export const getPublicNotesForUser = async (req, res) => {
    const { userId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid user ID" });
    }
  
    try {
      const notes = await Note.find({
        userId,
        isPublic: true, // Only fetch public notes
      }).sort({ createdOn: -1 }); // Sort by creation date (newest first)
  
      res.status(200).json({ error: false, notes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Server error" });
    }
  };


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

//PUT toggle pin controller
export const togglePin = async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      note.isPinned = isPinned;
  
      await note.save();
  
      return res.json({
        error: false,
        note,
        message: "Note pinned status updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  };

//PUT edit note controller
export const editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
  
    if (!title && !content && !tags) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      if (title) note.title = title;
      if (content) note.content = content;
      if (tags) note.tags = tags;
      if (isPinned) note.isPinned = isPinned;
  
      await note.save();
  
      return res.json({
        error: false,
        note,
        message: "Note updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  };

//DELETE Delete Note Controller
export const deleteUserNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      await Note.deleteOne({ _id: noteId, userId: user._id });
  
      return res.json({
        error: false,
        message: "Note deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  };

