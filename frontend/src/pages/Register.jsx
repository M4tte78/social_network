import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // ✅ Utilisation de useNavigate

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError("Tous les champs sont requis");
            return;
        }
        try {
            await register(username, email, password);
            setSuccess("Inscription réussie !");
            setError('');

            // ✅ Redirection après 2 secondes vers la page de connexion
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Erreur d'inscription", error);
            setError("Erreur d'inscription");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Inscription</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez votre nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" className="w-100" onClick={handleRegister}>
                            S'inscrire
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
