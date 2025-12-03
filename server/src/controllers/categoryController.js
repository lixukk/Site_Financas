// Importa o modelo do Mongoose criado no passo 1
const Category = require('../models/Category'); 

async function createCategory(req, res, next) {
  try {
    const { nome, tipo } = req.body;
    if (!nome || !tipo) return res.status(400).json({ error: 'nome e tipo são obrigatórios' });
    
    // Cria usando Mongoose
    const category = await Category.create({ nome, tipo });
    
    // Retorna formatado (id em vez de _id)
    res.status(201).json({ id: category._id, nome: category.nome, tipo: category.tipo });
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const tipo = req.query.tipo || null;
    const filter = {};
    if (tipo) filter.tipo = tipo;

    // Busca no MongoDB
    const categories = await Category.find(filter).sort({ nome: 1 });

    // Formata para o front-end (converte _id para id)
    const formatted = categories.map(cat => ({
      id: cat._id,
      nome: cat.nome,
      tipo: cat.tipo
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, listCategories };