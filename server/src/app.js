// server/src/app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
const routes = require('./routes');

const app = express();

// Habilita JSON
app.use(express.json());

// Habilita CORS corretamente
app.use(cors({
  origin: '*',          // Em produção, restrinja o domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rotas da API
app.use('/api', routes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
}

module.exports = app;
