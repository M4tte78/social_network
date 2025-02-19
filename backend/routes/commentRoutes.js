import express from 'express';
import { addComment, getCommentsByPost } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addComment);
router.get('/:post_id', authMiddleware, getCommentsByPost);

export default router;
