import jwt from 'jsonwebtoken';

const generateToken = (id) => 
    jwt.sign(
        { userId: id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

export default generateToken;