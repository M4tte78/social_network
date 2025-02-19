import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createPost);
router.get('/', authMiddleware, getAllPosts);

export default router;
