import express from "express"
const router = express.Router()

export default (db) => {
    //create notes
    router.post("/notes", async (req,res) => {
        const {title, content, tags = [], is_pinned = false, user_id} = req.body
        
        if(!user_id) {
            return res.status(400).send("User ID is required")
        }
    
    
        const result = await db.execute({
            sql: `
                INSERT INTO notes (title, content, tags, is_pinned, user_id)
                VALUES (?,?,?,?,?)
            `,
            args: [title, content, JSON.stringify(tags), is_pinned ? 1 : 0, user_id],
        });
    
    
        res.status(201).json({
            id: Number(result.lastInsertRowid),
            title,
            content,
            tags,
            is_pinned,
            user_id,
        })
        
    })
    return router;
}