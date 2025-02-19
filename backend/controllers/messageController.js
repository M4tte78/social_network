import { db } from '../config/db.js';

export const sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;

        if (!sender_id || !receiver_id || !content) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        await db.execute(
            "INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())",
            [sender_id, receiver_id, content]
        );

        res.status(201).json({ message: "Message envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;

        const [messages] = await db.execute(
            "SELECT sender_id, receiver_id, content, timestamp FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC",
            [sender_id, receiver_id, receiver_id, sender_id]
        );

        res.json(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getReceivedMessages = async (req, res) => {
    try {
        const { receiver_id } = req.params;

        const [messages] = await db.execute(
            "SELECT sender_id, sender_username, content, timestamp FROM messages WHERE receiver_id = ? ORDER BY timestamp DESC",
            [receiver_id]
        );

        if (messages.length === 0) {
            return res.status(200).json([]); // ✅ Retourne une liste vide si aucun message
        }

        res.json(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages reçus :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

