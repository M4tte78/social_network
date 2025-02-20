import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ Création du dossier 'uploads/avatars' s'il n'existe pas
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ✅ Tous les avatars vont dans 'uploads/avatars'
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// ✅ Filtrage des fichiers pour n'accepter que les images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Erreur: Seules les images JPEG, JPG, PNG et GIF sont autorisées.'));
    }
};

// ✅ Export du middleware 'upload' pour être utilisé dans les routes
export const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // Limite à 5 Mo par image
    }
});
