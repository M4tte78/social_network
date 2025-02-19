import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/api';
import { Table, Button, Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error("Erreur lors de la récupération des utilisateurs", error);
            setLoading(false);
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
                                        <Button variant="danger" onClick={() => deleteUser(u.id)}>
                                            Supprimer
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
        </Container>
    );
};

export default Admin;
