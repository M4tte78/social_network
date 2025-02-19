import { useAuth } from '../hooks/useAuth'; // ✅ Vérifie le bon chemin d'importation

const Profile = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Profil de {user?.username}</h2>
            <p>Email: {user?.email}</p>
            <p>Description: {user?.description}</p>
        </div>
    );
};

export default Profile;
