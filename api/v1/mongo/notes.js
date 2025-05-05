import express from "express"
import {Note} from "../../../models/Note.js"
import { getAllNotes, createNote, addNote, searchNote,editNote, togglePin, getNoteByUser,getPublicNotesForUser, getNoteById, deleteUserNote } from "./controllers/notesController.js"
import {authUser} from "../../v1/middleware/auth.js"

const router = express.Router()

//Get all notes
router.get("/notes", getAllNotes);

//Create a note
router.post("/notes", createNote);

//Add note
router.post("/add-note", authUser, addNote);

//Edit note
router.put("/edit-note/:noteId", authUser, editNote);

//Update isPinned
router.put("/update-note-pinned/:noteId", authUser, togglePin);


//Get Notes by user 
router.get("/get-notes-by-user", authUser, getNoteByUser);

//Get public notes for user
router.get("/public-notes/:userId", getPublicNotesForUser);

//Get a note by noteId 
router.get("/get-note/:noteId", authUser, getNoteById);

//Delete note 
router.delete("/delete-note/:noteId", authUser, deleteUserNote);

//Search notes
router.get("/search-notes", authUser, searchNote);


export default router;