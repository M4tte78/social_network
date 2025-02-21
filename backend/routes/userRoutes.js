import express from 'express';
import { register, login, getAllUsers, deleteUser, updateUserRole, updateAvatar } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', protect, adminOnly, getAllUsers); // ✅ Seuls les admins peuvent voir tous les utilisateurs
router.delete('/:id', protect, adminOnly, deleteUser); // ✅ Suppression utilisateur par admin
router.put('/:id', protect, adminOnly, updateUserRole); // ✅ Changement de rôle par admin
router.put('/:userId/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
