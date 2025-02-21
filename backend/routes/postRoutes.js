import express from 'express';
import { createPost, getAllPosts, deletePost, updatePost } from '../controllers/postController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost); 
router.get('/', getAllPosts);
router.delete('/:id', protect, adminOnly, deletePost); // ✅ Suppression de post par admin
router.put('/:id', protect, adminOnly, upload.single('image'), updatePost); // ✅ Modification de post par admin

export default router;
