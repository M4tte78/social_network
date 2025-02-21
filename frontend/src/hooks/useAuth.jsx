import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token'); // ✅ Récupère le token

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);

                // Vérification que l'utilisateur est valide
                if (parsedUser && parsedUser.id) {
                    setUser(parsedUser);

                    // ✅ Définit le token dans les headers d'axios pour les requêtes protégées
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token'); // ✅ Supprime le token si invalide
                    setUser(null);
                }
            } catch (error) {
                console.error("Erreur lors du parsing de l'utilisateur stocké :", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token); // ✅ Stocke le token
        setUser(userData);

        // ✅ Définit le token dans les headers d'axios après connexion
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // ✅ Supprime le token à la déconnexion
        setUser(null);

        // ✅ Supprime le token des headers d'axios
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = useMemo(() => ({
        user,
        setUser,
        login,
        logout,
        loading
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
