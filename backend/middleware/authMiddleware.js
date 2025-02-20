import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

// Middleware pour protéger les routes (vérification du token JWT)
export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer"

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupère l'utilisateur et son rôle
        const [rows] = await db.execute(
            "SELECT id, username, role FROM users WHERE id = ?",
            [decoded.id]
        );
        req.user = rows[0];
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide." });
    }
};