import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET est manquant dans .env");
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
