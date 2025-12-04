// server/src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // <--- 1. IMPORTANTE: Biblioteca de logs
const mongoose = require('mongoose'); // Para verificar o status do banco
require('dotenv').config();
const connectDB = require('./config/db');

// Conecta ao Banco
connectDB();

const routes = require('./routes');
const app = express();

// Habilita JSON
app.use(express.json());

// Habilita CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- SEU "POSTMAN NO CÓDIGO" ---
// Isso mostra no terminal: "GET /api/transactions 200 15.234 ms"
app.use(morgan('dev')); 

// --- ROTA PARA TESTAR CONEXÃO ---
// Acesse http://localhost:4000/api/status para testar
app.get('/api/status', (req, res) => {
  const dbStates = {
    0: 'Desconectado',
    1: 'Conectado (Verde)',
    2: 'Conectando...',
    3: 'Desconectando...'
  };
  
  res.json({
    servidor: 'Online 🚀',
    banco_de_dados: dbStates[mongoose.connection.readyState] || 'Erro',
    time: new Date().toLocaleTimeString()
  });
});

// Rotas da API
app.use('/api', routes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro no Servidor:', err); // Loga o erro no terminal
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
}

module.exports = app;