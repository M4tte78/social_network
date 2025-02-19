import { useState, useEffect } from 'react';
import { getAllPosts, getReceivedMessages } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Container, Spinner, ListGroup } from 'react-bootstrap';
import { io } from 'socket.io-client';
const socket = io("http://localhost:5000"); // ✅ Connexion au WebSocket


const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPosts();
            fetchMessages();
            
            socket.on('receiveMessage', (newMessage) => {
                if (newMessage.receiver_id === user.id) {
                    setMessages((prevMessages) => [newMessage, ...prevMessages]);
                }
            });
    
            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [user]);
    

    const fetchPosts = async () => {
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des posts", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const data = await getReceivedMessages(user.id);
            console.log("Messages reçus sur Home.jsx :", data); // ✅ Vérifie dans la console
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages reçus", error);
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">🏋️ Fil d'actualité</h2>

            {/* Messages Reçus */}
            <h3 className="mt-4">📩 Messages Privés</h3>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : messages.length > 0 ? (
                <ListGroup className="mb-3">
                    {messages.map((msg, index) => (
                        <ListGroup.Item key={index} className="text-start">
                            <strong>{msg.sender_username || "Utilisateur inconnu"} :</strong> {msg.content}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-muted">Aucun message reçu.</p>
            )}

            {/* Affichage des Posts */}
            <h3 className="mt-4">📢 Publications</h3>
            {posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
                <p className="text-muted text-center">Aucune publication disponible.</p>
            )}
        </Container>
    );
};

export default Home;
