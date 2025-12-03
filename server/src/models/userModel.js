// server/src/models/userModel.js
const pool = require('../config/db');

async function createUser({ nome, email, senhaHash }) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return { id: result.insertId, nome, email };
}

async function findByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createUser, findByEmail, findById };
