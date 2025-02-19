import express from 'express';
import { sendMessage, getReceivedMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Vérifie bien ce chemin

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/received/:receiver_id', protect, getReceivedMessages); // ✅ Protège la route

export default router;
