import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../config/auth.js';

// Fonction d'inscription
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length) {
            return res.status(400).json({ message: "Cet utilisateur existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Fonction de connexion
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (!users.length) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute("SELECT id, username, email, role FROM users");
        res.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

