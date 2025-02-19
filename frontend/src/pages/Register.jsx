import { useState } from 'react';
import { register } from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            alert("Tous les champs sont requis");
            return;
        }
        try {
            await register(username, email, password);
            alert("Inscription réussie !");
        } catch (error) {
            console.error("Erreur d'inscription", error);
            alert("Erreur d'inscription");
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" />
            <button onClick={handleRegister}>S'inscrire</button>
        </div>
    );
};

export default Register;
