// Importar bibliotecas necessárias
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';

// Configurar dotenv
dotenv.config();

// Criar a instância do Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error);
    });
    
// Definir uma rota simples
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Rotas de autenticação
app.use('/api/restaurants', authRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
    
