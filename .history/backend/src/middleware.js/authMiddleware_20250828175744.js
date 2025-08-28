// src/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    let token;

    // Verifica se o token está no cabeçalho Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtém o token do cabeçalho
            token = req.headers.authorization.split(' ')[1];

            // Decodifica o token para obter o ID do restaurante
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Armazena o ID do usuário na requisição
            req.restaurantId = decoded.id;

            next(); // Permite que a requisição continue
        } catch (error) {
            res.status(401).json({ message: 'Não autorizado, token inválido.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, token não encontrado.' });
    }
};

export default protect;