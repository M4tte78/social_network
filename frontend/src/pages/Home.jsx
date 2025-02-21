import { useState, useEffect } from 'react';
import { getAllPosts, getReceivedMessages, deletePost, getLikes, toggleLike, addComment, getCommentsByPost } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Spinner, ListGroup, Card, Button, Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';
import CreatePost from '../components/CreatePost';
import axios from 'axios';

const socket = io("http://localhost:5000");

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [updatedContent, setUpdatedContent] = useState('');
    const [updatedImage, setUpdatedImage] = useState(null);
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [showComment, setShowComment] = useState({});  // ✅ Utilisation d'un objet pour les commentaires
    const [newComment, setNewComment] = useState('');

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

            data.forEach(post => {
                fetchLikes(post.id);
                fetchComments(post.id);
            });
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

    const handleEdit = (postId, currentContent) => {
        setSelectedPostId(postId);
        setUpdatedContent(currentContent); 
        setShowModal(true);  // ✅ Ouvre le modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostId(null);
        setUpdatedContent('');
        setUpdatedImage(null);
    };

    const handleUpdate = async () => {
        if (!selectedPostId) {
            console.error("❌ Aucun post sélectionné pour la mise à jour.");
            return;
        }
    
        const formData = new FormData();
        formData.append('content', updatedContent);
        if (updatedImage) {
            formData.append('image', updatedImage);
        }
    
        try {
            await axios.put(`http://localhost:5000/api/posts/${selectedPostId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("✅ Publication mise à jour avec succès !");
            handleCloseModal();
            fetchPosts(); 
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour du post :", error);
        }
    };

    const handleLike = async (postId) => {
        try {
            await toggleLike(user.id, postId);
            fetchLikes(postId);
        } catch (error) {
            console.error("❌ Erreur lors du like :", error);
        }
    };

    const fetchLikes = async (postId) => {
        try {
            const count = await getLikes(postId);
            setLikes((prev) => ({ ...prev, [postId]: count }));
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des likes :", error);
        }
    };

    const handleComment = async (postId) => {
        if (newComment.trim() === '') return;

        try {
            await addComment(postId, user.id, newComment);
            setNewComment('');
            fetchComments(postId);
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du commentaire :", error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const data = await getCommentsByPost(postId);
            setComments((prev) => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des commentaires :", error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">🏋️ Fil d'actualité</h2>

            <CreatePost onPostCreated={fetchPosts} />

            <h3 className="mt-4">📢 Publications</h3>
            <div className="d-flex flex-wrap justify-content-center">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} className="m-3" style={{ width: '22rem' }}>
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:5000/uploads/avatars/${post.image}`}
                                style={{ height: '500px', objectFit: 'cover' }} 
                            />

                            <Card.Body>
                                <Card.Title className="text-primary">
                                    {post.username || "Utilisateur inconnu"}
                                </Card.Title>

                                <Card.Text>{post.content}</Card.Text>

                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleLike(post.id)}>
                                    J'aime ({likes[post.id] || 0})
                                </Button>

                                <Button variant="outline-secondary" size="sm" onClick={() => setShowComment(prev => ({
                                    ...prev,
                                    [post.id]: !prev[post.id]
                                }))}>
                                    Commenter
                                </Button>

                                {showComment[post.id] && (
                                    <>
                                        <textarea 
                                            className="form-control mt-2"
                                            placeholder="Ajouter un commentaire..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        ></textarea>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="mt-2"
                                            onClick={() => handleComment(post.id)}
                                        >
                                            Publier
                                        </Button>
                                    </>
                                )}

                                {comments[post.id] && comments[post.id].map((comment, index) => (
                                    <ListGroup.Item key={index}>
                                        <strong>{comment.username} :</strong> {comment.content}
                                    </ListGroup.Item>
                                ))}

                                {user?.role === "admin" && (
                                    <>
                                    <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2 mt-2"
                                            onClick={() => handleEdit(post.id, post.content, post.image)}
                                        >
                                            Modifier
                                        </Button>
                                       {/* Modal de modification */}
                                        <Modal show={showModal} onHide={handleCloseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Modifier la publication</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <textarea
                                                    className="form-control"
                                                    value={updatedContent}
                                                    onChange={(e) => setUpdatedContent(e.target.value)}
                                                    placeholder="Modifier la description..."
                                                    rows="3"
                                                    required
                                                ></textarea>
                                                <input
                                                    type="file"
                                                    className="form-control mt-3"
                                                    onChange={(e) => setUpdatedImage(e.target.files[0])}
                                                    accept="image/*"
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseModal}>
                                                    Annuler
                                                </Button>
                                                <Button variant="primary" onClick={handleUpdate}>
                                                    Enregistrer
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Button variant="danger" size="sm" className="mt-2" onClick={() => handleDelete(post.id)}>
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
        </Container>
    );
};

export default Home;
