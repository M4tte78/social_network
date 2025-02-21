import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fonction pour ajouter un commentaire
export const addComment = async (postId, userId, content) => {
    const response = await axios.post(`${API_URL}/comments/add`, { post_id: postId, user_id: userId, content });
    return response.data;
};

// Créer une publication
export const createPost = async (formData) => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/posts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
    });
};

// Récupérer toutes les publications
export const getAllPosts = async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
};

export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${API_URL}/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du post :", error);
        throw error;
    }
};

// Mettre à jour l'avatar
export const updateAvatar = async (userId, formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/avatar`, 
        formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};


// Fonction pour récupérer les commentaires d'un post
export const getCommentsByPost = async (post_id) => {
    const response = await axios.get(`http://localhost:5000/api/comments/${post_id}`);
    return response.data;
};


// Supprimer un utilisateur (Admin)
export const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// Modifier le rôle d'un utilisateur (Admin)
export const updateUserRole = async (id, role) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/users/${id}`, { role }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};


// Modifier une publication (Admin)
export const updatePost = async (id, formData) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/posts/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
    });
};

// Fonction pour liker/déliker un post
export const toggleLike = async (user_id, post_id) => {
    const response = await axios.post('http://localhost:5000/api/likes/toggle', { user_id, post_id });
    return response.data;
};

// Fonction de connexion
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
};

// Fonction d'inscription
export const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/users/register`, { username, email, password });
    return response.data;
};

// Récupération de tous les utilisateurs (pour Admin)
export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};


// Récupération des messages
export const getMessages = async (sender_id, receiver_id) => {
    const response = await axios.get(`${API_URL}/messages/${sender_id}/${receiver_id}`);
    return response.data;
};

// Envoi d'un message
export const sendMessage = async (senderId, receiverId, content) => {
    await axios.post(`${API_URL}/messages/send`, { sender_id: senderId, receiver_id: receiverId, content });
};

export const getReceivedMessages = async (receiver_id) => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/messages/received/${receiver_id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Messages reçus :", response.data); // ✅ Vérifie la réponse dans la console du navigateur
    return response.data;
};

export const getLikes = async (post_id) => {
    const response = await axios.get(`http://localhost:5000/api/likes/${post_id}`);
    return response.data.count;
};

