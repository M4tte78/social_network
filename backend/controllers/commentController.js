import { db } from '../config/db.js';

// Ajouter un commentaire
export const addComment = async (req, res) => {
    const { post_id, user_id, content } = req.body;
    try {
        await db.execute("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", 
        [post_id, user_id, content]);
        res.status(201).json({ message: "Commentaire ajouté avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les commentaires d'un post
export const getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;
    try {
        const [comments] = await db.execute("SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY created_at DESC", [post_id]);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
