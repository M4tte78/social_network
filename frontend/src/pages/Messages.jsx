import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMessages } from '../services/api';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000"); // ✅ Connexion au serveur WebSocket

const Messages = () => {
    const { user } = useAuth();
    const [receiverId, setReceiverId] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (user && receiverId) {
            fetchMessages();
        }
    }, [receiverId]);

    useEffect(() => {
        // Écoute des nouveaux messages en temps réel
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage'); // Nettoie l'écouteur d'événements
        };
    }, []);

    const fetchMessages = async () => {
        if (!user || !receiverId) return;
        try {
            const data = await getMessages(user.id, receiverId);
            setMessages(data);
        } catch (error) {
            console.error("Erreur de récupération des messages", error);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !receiverId) return;
        const messageData = {
            sender_id: user.id,
            receiver_id: receiverId,
            content: newMessage
        };

        socket.emit('sendMessage', messageData); // ✅ Envoie du message via WebSocket
        setNewMessage('');
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">
                <img src="https://img.icons8.com/emoji/48/000000/envelope-emoji.png" alt="mail" /> Messagerie Privée
            </h2>

            <Form.Group className="mb-3">
                <Form.Label>Choisir l'ID du destinataire :</Form.Label>
                <Form.Control 
                    type="text"
                    placeholder="ID de l'utilisateur"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                />
            </Form.Group>

            <ListGroup className="mb-3">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <ListGroup.Item key={index} className={msg.sender_id === user.id ? 'text-end' : 'text-start'}>
                            <strong>{msg.sender_id === user.id ? 'Moi' : `Utilisateur ${msg.sender_id}`}:</strong> {msg.content}
                        </ListGroup.Item>
                    ))
                ) : (
                    <p className="text-muted">Aucun message pour le moment.</p>
                )}
            </ListGroup>

            <Form.Group className="d-flex">
                <Form.Control 
                    type="text"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="primary" onClick={handleSendMessage} className="ms-2">Envoyer</Button>
            </Form.Group>
        </Container>
    );
};

export default Messages;
