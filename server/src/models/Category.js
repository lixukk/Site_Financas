const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);