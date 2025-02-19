import { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const { user, token } = await login(email, password);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            console.error("Erreur de connexion", error);
        }
    };

    const handleRegister = async (username, email, password) => {
        try {
            await register(username, email, password);
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
