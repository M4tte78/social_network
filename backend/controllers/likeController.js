import { db } from '../config/db.js';

export const toggleLike = async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const [likes] = await db.execute("SELECT * FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id]);

        if (likes.length) {
            await db.execute("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [user_id, post_id]);
            return res.json({ message: "Like retiré" });
        } else {
            await db.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [user_id, post_id]);
            return res.status(201).json({ message: "Like ajouté" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
