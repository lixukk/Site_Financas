// CÓDIGO FINAL DE server/index.js (NA RAIZ DE SERVER)

const express = require('express');
const cors = require('cors'); 
// CORREÇÃO: Adicione './src/' nos requires internos
const { connectDB } = require('./config/db'); 
const { getAllTransactions, createTransaction } = require('./controllers/transactionController'); 

const app = express();
const PORT = 3001;

// --- Configurações/Middlewares ---
connectDB(); 

app.use(cors()); 
app.use(express.json()); 

// --- Rotas da API ---
app.get('/api/transactions', getAllTransactions);
app.post('/api/transactions', createTransaction);

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});