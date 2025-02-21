import express from 'express';
import { toggleLike, getLikes } from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/toggle', protect, toggleLike);
router.get('/:post_id', protect, getLikes);

export default router;
