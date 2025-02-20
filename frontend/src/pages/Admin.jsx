import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUserRole } from '../services/api';
import { Table, Button, Container, Spinner, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});

    // Charger la liste des utilisateurs
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            setLoading(false);
        }
    };

    // Supprimer un utilisateur
    const handleDelete = async (userId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error("Erreur lors de la suppression de l'utilisateur :", error);
            }
        }
    };

    // Ouvrir le modal pour modifier le rôle
    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Fermer le modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser({});
    };

    // Modifier le rôle d'un utilisateur
    const handleUpdateRole = async (e) => {
        e.preventDefault();
        try {
            await updateUserRole(selectedUser.id, selectedUser.role);
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du rôle :", error);
        }
    };

    return (
        <Container>
            <h2 className="mt-4 text-center">🛠️ Panneau d'administration</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : users.length > 0 ? (
                <>
                    <h3>Utilisateurs</h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            onClick={() => handleDelete(u.id)}
                                            className="me-2"
                                        >
                                            Supprimer
                                        </Button>
                                        <Button 
                                            variant="warning" 
                                            onClick={() => openModal(u)}
                                        >
                                            Modifier
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                <p className="text-muted text-center">Aucun utilisateur trouvé.</p>
            )}

            {/* Modal de Modification du Rôle */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le rôle</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateRole}>
                    <Modal.Body>
                        <Form.Group controlId="role">
                            <Form.Label>Rôle</Form.Label>
                            <Form.Select 
                                value={selectedUser.role} 
                                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                            >
                                <option value="user">Utilisateur</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Annuler</Button>
                        <Button type="submit" variant="primary">Enregistrer</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Admin;
