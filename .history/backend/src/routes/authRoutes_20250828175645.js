// src/routes/authRoutes.js

import express from 'express';
import Restaurant from '../models/Restaurant.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

// @route   POST /api/restaurants/register
// @desc    Registrar um novo restaurante
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Verificar se o restaurante já existe
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        // 2. Criar um novo restaurante
        const newRestaurant = new Restaurant({
            name,
            email,
            password, // A senha será criptografada pelo hook 'pre-save' no modelo
        });

        // 3. Salvar o restaurante no banco de dados
        await newRestaurant.save();

        res.status(201).json({
            message: 'Restaurante registrado com sucesso!',
            restaurant: {
                id: newRestaurant._id,
                name: newRestaurant.name,
                email: newRestaurant.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

// @route   POST /api/restaurants/login
// @desc    Fazer login de um restaurante
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar se o restaurante existe
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        // 2. Comparar a senha fornecida com a senha criptografada
        const isMatch = await restaurant.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: restaurant._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // 3. Login bem-sucedido
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token,
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                email: restaurant.email,
            },
            // Em um projeto real, você retornaria um token JWT aqui
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

export default router;