import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Container, Card, Button, Form, Image } from 'react-bootstrap';
import { updateAvatar } from '../services/api'; // ✅ Import de l'API pour mettre à jour l'avatar

const Profile = () => {
    const { user, setUser } = useAuth(); // ✅ Assure-toi que setUser est bien récupéré
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(
        user?.avatar 
            ? `http://localhost:5000/uploads/avatars/${user.avatar}` 
            : "http://localhost:5000/uploads/avatars/default.png"
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file && allowedTypes.includes(file.type)) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        } else {
            alert("Format d'image non supporté. Utilisez JPEG, JPG ou PNG.");
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();

        if (!avatar) {
            alert("Veuillez sélectionner une image.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", avatar);

        try {
            const updatedUser = await updateAvatar(user.id, formData);
            alert("Avatar mis à jour avec succès !");

            // ✅ Mise à jour du localStorage et du contexte utilisateur
            const newUserData = { ...user, avatar: updatedUser.avatar };
            localStorage.setItem('user', JSON.stringify(newUserData));
            setUser(newUserData); // ✅ Mise à jour correcte du contexte

            window.location.reload(); // ✅ Recharge la page pour afficher le nouvel avatar
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avatar :", error);
            alert("Une erreur est survenue lors de la mise à jour de l'avatar.");
        }
    };

    return (
        <Container className="mt-5">
            <Card style={{ maxWidth: '600px', margin: '0 auto' }} className="shadow-sm">
                <Card.Header className="text-center">
                    <h3>Profil de {user?.username}</h3>
                </Card.Header>
                <Card.Body className="text-center">
                    <Image 
                        src={preview} 
                        alt="Avatar" 
                        roundedCircle 
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                        className="mb-3"
                    />
                    <Form onSubmit={handleAvatarUpload}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Changer d'avatar</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Mettre à jour l'avatar
                        </Button>
                    </Form>
                    <hr />
                    <Card.Text>
                        <strong>Email :</strong> {user?.email}
                    </Card.Text>
                    <Card.Text>
                        <strong>Description :</strong> {user?.description || "Pas de description disponible."}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                    <Button variant="primary" className="me-2">Modifier le profil</Button>
                    <Button variant="danger">Supprimer le compte</Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Profile;
