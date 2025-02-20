import express from 'express';
import { register, login, getAllUsers, deleteUser, updateUserRole, updateAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
router.delete('/:id', protect, deleteUser); // ✅ Suppression d'un utilisateur (Admin)
router.put('/:id', protect, updateUserRole); // ✅ Modification du rôle (Admin)
router.put('/:userId/avatar', protect, upload.single('avatar'), updateAvatar); // ✅ Mise à jour de l'avatar

export default router;
