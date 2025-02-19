import { useState } from 'react';
import { toggleLike } from '../services/api'; // ✅ Vérifie que c'est bien importé

const LikeButton = ({ postId, userId }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        try {
            await toggleLike(postId, userId);
            setLiked(!liked);
        } catch (error) {
            console.error("Erreur lors du like", error);
        }
    };

    return <button onClick={handleLike}>{liked ? "❤️" : "🤍"}</button>;
};

export default LikeButton;
