import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useRedirect from '../hooks/useRedirect';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const navigate = useRedirect();

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        navigate('/login'); // ✅ Redirection ici
        return null;
    }

    if (adminOnly && user.role !== 'admin') {
        navigate('/'); // ✅ Redirection si l'utilisateur n'est pas admin
        return null;
    }

    return children;
};

export default ProtectedRoute;
