import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer"

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Stocke l'utilisateur dans `req.user`
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide." });
    }
};
