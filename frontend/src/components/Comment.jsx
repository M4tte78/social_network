import { useState, useEffect } from 'react';
import { addComment, getCommentsByPost } from '../services/api'; // ✅ Vérifie que c'est bien importé

const Comment = ({ postId, userId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const data = await getCommentsByPost(postId);
            setComments(data);
        } catch (error) {
            console.error("Erreur de récupération des commentaires", error);
        }
    };

    const handleComment = async () => {
        if (!text.trim()) return;
        try {
            await addComment(postId, userId, text);
            setText('');
            fetchComments(); // Actualise les commentaires après ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire", error);
        }
    };

    return (
        <div className="comment-section">
            {comments.map((c) => (
                <p key={c.id}>{c.username}: {c.content}</p>
            ))}
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Ajouter un commentaire..." 
            />
            <button onClick={handleComment}>Envoyer</button>
        </div>
    );
};

export default Comment;
