import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { db } from './config/db.js';

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Vérification de la connexion au démarrage du serveur
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('🗄️ Connexion au pool MySQL réussie');
        connection.release(); // Libère la connexion
    } catch (err) {
        console.error('❌ Erreur de connexion à la base de données:', err);
        process.exit(1);
    }
})();


// ✅ CORS : Configuration améliorée
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ Middleware pour parser le JSON
app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// ✅ Socket.io
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('🔌 Nouvelle connexion Socket.io:', socket.id);

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Déconnexion Socket.io:', socket.id);
    });
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
