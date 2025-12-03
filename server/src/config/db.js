// server/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // A string de conexão do Mongo (pode estar no .env como MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/financas_app');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;