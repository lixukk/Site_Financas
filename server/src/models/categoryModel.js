// server/src/models/categoryModel.js
const pool = require('../config/db');

async function createCategory({ nome, tipo }) {
  const [result] = await pool.execute('INSERT INTO categorias (nome, tipo) VALUES (?, ?)', [nome, tipo]);
  return { id: result.insertId, nome, tipo };
}

async function listCategories(tipo = null) {
  if (tipo) {
    const [rows] = await pool.execute('SELECT * FROM categorias WHERE tipo = ?', [tipo]);
    return rows;
  }
  const [rows] = await pool.execute('SELECT * FROM categorias ORDER BY nome');
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await pool.execute('SELECT * FROM categorias WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createCategory, listCategories, getCategoryById };
