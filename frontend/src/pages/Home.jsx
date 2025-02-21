import { useState, useEffect } from 'react';
import { getAllPosts, getReceivedMessages, deletePost } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Spinner, ListGroup, Card, Button, Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';
import CreatePost from '../components/CreatePost';

const socket = io("http://localhost:5000");

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

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
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages reçus", error);
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
                console.log("Publication supprimée :", postId);
            } catch (error) {
                console.error("Erreur lors de la suppression du post", error);
            }
        }
    };

    const handleEdit = (postId) => {
        setSelectedPostId(postId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostId(null);
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">🏋️ Fil d'actualité</h2>

            {/* Formulaire de publication */}
            <CreatePost onPostCreated={fetchPosts} />

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
            <div className="d-flex flex-wrap justify-content-center">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} className="m-3" style={{ width: '22rem' }}>
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:5000/uploads/${post.image}`} 
                                style={{ 
                                    height: '300px', 
                                    objectFit: 'cover' 
                                }} 
                            />
                            <Card.Body>
                                <Card.Title className="text-primary">
                                    {post.user?.username || "Utilisateur inconnu"}
                                </Card.Title>
                                <Card.Text>{post.content}</Card.Text>

                                <Button variant="outline-primary" size="sm" className="me-2">J'aime</Button>
                                <Button variant="outline-secondary" size="sm">Commenter</Button>

                                {/* Affichage conditionnel des boutons Modifier et Supprimer pour les admins */}
                                {user?.role === "admin" && (
                                    <>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2 mt-2"
                                            onClick={() => handleEdit(post.id)}
                                        >
                                            Modifier
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            className="mt-2"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Supprimer
                                        </Button>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted text-center">Aucune publication disponible.</p>
                )}
            </div>

            {/* Modal de modification */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier la publication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Formulaire de modification à ajouter ici...</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary">
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Home;
