import { useState, useEffect } from 'react';
import { getAllPosts, getReceivedMessages, deletePost, updatePost } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Spinner, ListGroup, Card, Button, Modal, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import CreatePost from '../components/CreatePost';

const socket = io("http://localhost:5000");

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPost, setCurrentPost] = useState({});

    // Charger les posts et les messages reçus
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

    // Récupérer les publications
    const fetchPosts = async () => {
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des posts", error);
        }
    };

    // Récupérer les messages reçus
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

    // Supprimer une publication
    const handleDelete = async (postId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette publication ?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (error) {
                console.error("Erreur lors de la suppression de la publication :", error);
            }
        }
    };

    // Ouvrir le modal de modification
    const handleEdit = (post) => {
        setCurrentPost(post);
        setShowEditModal(true);
    };

    // Fermer le modal de modification
    const handleCloseModal = () => {
        setShowEditModal(false);
        setCurrentPost({});
    };

    // Modifier une publication
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('content', currentPost.content);
        if (e.target.image.files[0]) {
            formData.append('image', e.target.image.files[0]);
        }

        try {
            await updatePost(currentPost.id, formData);
            setShowEditModal(false);
            fetchPosts();
        } catch (error) {
            console.error("Erreur lors de la modification de la publication :", error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">🏋️ Fil d'actualité</h2>
            <br />
            <h3 className="text-center">📸 Créer une publication</h3>


            {/* Formulaire de création de publication */}
            <CreatePost />

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
                            <Card.Title>{post.username}</Card.Title>
                            <Card.Text>{post.content}</Card.Text>
                            <small className="text-muted">Publié le : {new Date(post.created_at).toLocaleDateString()}</small>

                            {/* Boutons Admin */}
                            {user.role === 'admin' && (
                                <div className="mt-3">
                                    <Button variant="danger" onClick={() => handleDelete(post.id)} className="me-2">Supprimer</Button>
                                    <Button variant="warning" onClick={() => handleEdit(post)}>Modifier</Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-muted text-center">Aucune publication disponible.</p>
            )}

            {/* Modal de Modification */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier la publication</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdate}>
                    <Modal.Body>
                        <Form.Group controlId="content">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                value={currentPost.content} 
                                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="image" className="mt-3">
                            <Form.Label>Changer l'image (optionnel)</Form.Label>
                            <Form.Control type="file" accept="image/*" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                        <Button type="submit" variant="primary">Enregistrer</Button>
                    </Modal.Footer>
                </Form>
                
            </Modal>
            </div>
        </Container>
    );
};

export default Home;
