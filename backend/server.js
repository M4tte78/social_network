import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { db } from './config/db.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Remplace par l'URL de ton frontend si nécessaire
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads')); // ✅ Pour servir les images statiques
app.use('/uploads/avatars', express.static('uploads/avatars'));


io.on('connection', (socket) => {
    console.log(`📡 Un utilisateur connecté : ${socket.id}`);

    // Réception d'un message du client
    socket.on('sendMessage', async ({ sender_id, receiver_id, content }) => {
        try {
            // Récupérer le pseudo de l'expéditeur
            const [sender] = await db.execute("SELECT username FROM users WHERE id = ?", [sender_id]);
            if (!sender.length) return;

            const sender_username = sender[0].username;

            // Enregistrer le message en base de données
            await db.execute(
                "INSERT INTO messages (sender_id, receiver_id, sender_username, content) VALUES (?, ?, ?, ?)",
                [sender_id, receiver_id, sender_username, content]
            );

            // Envoyer le message en temps réel à l'utilisateur concerné
            io.emit('receiveMessage', { sender_id, receiver_id, sender_username, content, timestamp: new Date() });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Utilisateur déconnecté : ${socket.id}`);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Serveur WebSocket démarré sur http://localhost:${PORT}`));
