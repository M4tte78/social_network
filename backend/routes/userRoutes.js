import express from 'express';
import { register, login, getAllUsers } from '../controllers/userController.js';
import { deleteUser, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
router.delete('/:id', protect, deleteUser); // ✅ Suppression d'un utilisateur (Admin)
router.put('/:id', protect, updateUserRole); // ✅ Modification du rôle (Admin)

export default router;
