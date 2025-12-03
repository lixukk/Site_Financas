// server/src/controllers/categoryController.js
const categoryModel = require('../models/categoryModel');

async function createCategory(req, res, next) {
  try {
    const { nome, tipo } = req.body;
    if (!nome || !tipo) return res.status(400).json({ error: 'nome e tipo são obrigatórios' });
    const cat = await categoryModel.createCategory({ nome, tipo });
    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const tipo = req.query.tipo || null;
    const cats = await categoryModel.listCategories(tipo);
    res.json(cats);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, listCategories };
