import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { createClient } from "@libsql/client"
import apiRoutes from "./api/v1/routes.js"
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config()


const app = express()
app.set("trust proxy", 1);

const PORT = process.env.PORT  

app.use(cors({
    origin: ["http://localhost:5173", "https://frontend-note-app-six.vercel.app"],
    credentials: true
}))

app.use(express.json())

app.use(cookieParser());

const db = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

//Initialize the tables (users, notes)

(async () => {
    //Connect to MongoDB via Mongoose
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Mongo database")
    } catch (err) {
        console.error(`MongoDB connection error: ${err}`)
        process.exit(1); //end the connection

    }
    //Ping Turso
    try {
        await db.execute("SELECT 1")
        console.log("successful communication with turso database")
    } catch (err) {
        console.error("Failed to connect to Turso",err)
        process.exit(1); 

    }


    //initialize turso tables (users, notes)
    //db.execute ติดต่อ database
    await db.execute(` 
        CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT, --JSON-encoded array of strings
        is_pinned INTEGER DEFAULT 0, -- 0 = false, 1 = true
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER
      );
   `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );
 `)
})()

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Note App API!" });
});


app.use("/", apiRoutes(db));


app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`)
})
