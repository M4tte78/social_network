import { useContext, createContext, useState, useEffect } from 'react';

const AuthContext = createContext(); // ✅ Crée le contexte

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>  {/* ✅ Ajoute setUser ici */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // ✅ Assure-toi que ce hook soit utilisé partout
