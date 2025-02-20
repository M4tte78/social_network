import { db } from '../config/db.js';

// Créer une publication avec image et description
export const createPost = async (req, res) => {
    try {
        const { user_id, content } = req.body;
        const image = req.file ? req.file.filename : null;

        console.log("📥 Données reçues :", req.body);
        console.log("📸 Image reçue :", image);

        await db.execute(
            "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)",
            [user_id, content, image]
        );

        res.status(201).json({ message: 'Publication créée avec succès' });
    } catch (error) {
        console.error("❌ Erreur lors de la création de la publication :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer toutes les publications
export const getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.execute(
            "SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC"
        );
        res.json(posts);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des publications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer une publication (Admin)
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifie si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé." });
        }

        await db.execute("DELETE FROM posts WHERE id = ?", [id]);
        res.status(200).json({ message: 'Publication supprimée avec succès' });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la publication :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Modifier une publication (Admin)
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const image = req.file ? req.file.filename : null;

        // Vérifie si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé." });
        }

        if (image) {
            await db.execute(
                "UPDATE posts SET content = ?, image = ? WHERE id = ?",
                [content, image, id]
            );
        } else {
            await db.execute(
                "UPDATE posts SET content = ? WHERE id = ?",
                [content, id]
            );
        }

        res.status(200).json({ message: 'Publication mise à jour avec succès' });
    } catch (error) {
        console.error("❌ Erreur lors de la modification de la publication :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};