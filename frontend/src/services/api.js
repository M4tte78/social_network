import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fonction pour ajouter un commentaire
export const addComment = async (postId, userId, content) => {
    const response = await axios.post(`${API_URL}/comments/add`, { post_id: postId, user_id: userId, content });
    return response.data;
};

// Fonction pour récupérer tous les posts
export const getAllPosts = async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
};

// Fonction pour supprimer un post (Admin)
export const deletePost = async (postId) => {
    await axios.delete(`${API_URL}/posts/${postId}`);
};

// Fonction pour récupérer les commentaires d'un post
export const getCommentsByPost = async (postId) => {
    const response = await axios.get(`${API_URL}/comments/${postId}`);
    return response.data;
};


// Fonction pour liker/déliker un post
export const toggleLike = async (postId, userId) => {
    const response = await axios.post(`${API_URL}/likes/toggle`, { post_id: postId, user_id: userId });
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

// Suppression d'un utilisateur (pour Admin)
export const deleteUser = async (userId) => {
    await axios.delete(`${API_URL}/users/${userId}`);
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



