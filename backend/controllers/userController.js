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

// Supprimer un utilisateur (Admin)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifie si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé." });
        }

        await db.execute("DELETE FROM users WHERE id = ?", [id]);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Modifier le rôle d'un utilisateur (Admin)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Vérifie si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé." });
        }

        await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        res.status(200).json({ message: 'Rôle mis à jour avec succès' });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du rôle :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Mise à jour de l'avatar
export const updateAvatar = async (req, res) => {
    const userId = req.params.userId;
    const avatar = req.file ? req.file.filename : null;

    if (!avatar) {
        return res.status(400).json({ success: false, message: "Aucun fichier téléchargé." });
    }

    try {
        // ✅ Mise à jour de l'avatar dans la base de données
        await db.query(
            "UPDATE users SET avatar = ? WHERE id = ?",
            [avatar, userId]
        );

        res.status(200).json({ success: true, message: "Avatar mis à jour avec succès", avatar });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'avatar:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};


