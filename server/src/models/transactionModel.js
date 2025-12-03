// server/src/models/transactionModel.js
const pool = require('../config/db');

async function createTransaction({ usuario_id, categoria_id, descricao, valor, tipo, data }) {
  const [result] = await pool.execute(
    `INSERT INTO transacoes (usuario_id, categoria_id, descricao, valor, tipo, data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [usuario_id, categoria_id, descricao || null, valor, tipo, data]
  );
  return { id: result.insertId };
}

async function listTransactionsByUser(usuario_id, { limit = 100, offset = 0 } = {}) {
  const [rows] = await pool.execute(
    `SELECT t.*, c.nome as categoria_nome FROM transacoes t
     JOIN categorias c ON c.id = t.categoria_id
     WHERE t.usuario_id = ?
     ORDER BY t.data DESC, t.criado_em DESC
     LIMIT ? OFFSET ?`,
    [usuario_id, Number(limit), Number(offset)]
  );
  return rows;
}

async function getTransactionById(id) {
  const [rows] = await pool.execute('SELECT * FROM transacoes WHERE id = ?', [id]);
  return rows[0];
}

async function updateTransaction(id, fields = {}) {
  const parts = [];
  const vals = [];
  if (fields.categoria_id) { parts.push('categoria_id = ?'); vals.push(fields.categoria_id); }
  if (fields.descricao !== undefined) { parts.push('descricao = ?'); vals.push(fields.descricao); }
  if (fields.valor !== undefined) { parts.push('valor = ?'); vals.push(fields.valor); }
  if (fields.tipo) { parts.push('tipo = ?'); vals.push(fields.tipo); }
  if (fields.data) { parts.push('data = ?'); vals.push(fields.data); }
  if (parts.length === 0) throw new Error('Nada para atualizar');
  vals.push(id);
  const sql = `UPDATE transacoes SET ${parts.join(', ')} WHERE id = ?`;
  await pool.execute(sql, vals);
  return true;
}

async function deleteTransaction(id) {
  await pool.execute('DELETE FROM transacoes WHERE id = ?', [id]);
  return true;
}

module.exports = {
  createTransaction,
  listTransactionsByUser,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
