import express from 'express';
import { addComment, getCommentsByPost } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, addComment);
router.get('/:post_id', protect, getCommentsByPost);

export default router;
