import jwt from 'jsonwebtoken';
import config from '../../config/config.env.js';

const secret =config.JWT_SECRET ; // Store securely in env

export const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};
