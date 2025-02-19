import { db } from '../config/db.js';

export const createPost = async (req, res) => {
    const { user_id, content, image } = req.body;
    try {
        await db.execute("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)", 
        [user_id, content, image]);
        res.status(201).json({ message: "Post créé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.execute("SELECT * FROM posts ORDER BY created_at DESC");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
