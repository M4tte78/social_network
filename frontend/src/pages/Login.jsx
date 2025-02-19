import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (error) {
            setError("Échec de la connexion. Vérifiez vos informations.");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">Connexion</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleLogin} className="w-100">Se connecter</Button>
            </Form>
        </Container>
    );
};

export default Login;
