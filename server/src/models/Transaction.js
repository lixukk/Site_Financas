const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  descricao: { type: String },
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  data: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);