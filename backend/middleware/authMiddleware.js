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
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        
        req.user = rows[0];
        
        next();
    } catch (error) {
        console.error("Erreur dans le middleware protect :", error);
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

// Middleware pour vérifier le rôle admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas administrateur." });
    }
};
