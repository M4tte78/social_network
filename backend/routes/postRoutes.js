import express from 'express';
import { createPost, getAllPosts, deletePost, updatePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost); // ✅ Création de publication
router.get('/', getAllPosts); // ✅ Récupération des publications
router.delete('/:id', protect, deletePost); // ✅ Suppression d'une publication (Admin)
router.put('/:id', protect, upload.single('image'), updatePost); // ✅ Modification d'une publication (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const postId = req.params.id;
        await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ message: "Publication supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du post :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
