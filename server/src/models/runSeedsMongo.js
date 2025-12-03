// server/src/models/runSeedsMongo.js
const mongoose = require('mongoose');
const Category = require('./Category'); 
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

const connectDB = async () => {
  try {
    // Garante que usa a mesma URL do seu arquivo .env ou o padrão local
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financas_app');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('Erro ao conectar:', err);
    process.exit(1);
  }
};

const seedCategories = async () => {
  await connectDB();

  const categories = [
    // Entradas
    { nome: 'Salário', tipo: 'entrada' },
    { nome: 'Investimentos', tipo: 'entrada' },
    { nome: 'Freelance', tipo: 'entrada' },
    { nome: 'Vendas', tipo: 'entrada' },
    { nome: 'Outros', tipo: 'entrada' },
    
    // Saídas
    { nome: 'Alimentação', tipo: 'saida' },
    { nome: 'Transporte', tipo: 'saida' },
    { nome: 'Moradia', tipo: 'saida' },
    { nome: 'Lazer', tipo: 'saida' },
    { nome: 'Saúde', tipo: 'saida' },
    { nome: 'Educação', tipo: 'saida' },
    { nome: 'Compras', tipo: 'saida' },
  ];

  try {
    // Limpa categorias antigas para não duplicar
    await Category.deleteMany(); 
    
    // Insere as novas
    await Category.insertMany(categories);
    
    console.log('✅ Categorias criadas com sucesso!');
    process.exit();
  } catch (err) {
    console.error('Erro ao criar seeds:', err);
    process.exit(1);
  }
};

seedCategories();