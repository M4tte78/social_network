import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createPost } from '../services/api';

const CreatePost = () => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('content', content);
        formData.append('image', image);

        console.log("📤 FormData envoyé :", formData);

        try {
            await createPost(formData);
            window.location.reload();
        } catch (error) {
            console.error("❌ Erreur lors de la création de la publication :", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
                <textarea
                    className="form-control"
                    placeholder="Écrire une description..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
            </div>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Publier</button>
        </form>
    );
};

export default CreatePost;
