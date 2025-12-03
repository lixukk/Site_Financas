// server/src/controllers/dashboardController.js
const pool = require('../config/db');

async function getBalance(req, res, next) {
  try {
    const usuario_id = req.user.id;
    const [rows] = await pool.execute(
      `SELECT
         SUM(CASE WHEN tipo='entrada' THEN valor ELSE -valor END) as saldo
       FROM transacoes WHERE usuario_id = ?`,
      [usuario_id]
    );
    res.json({ saldo: Number(rows[0].saldo || 0).toFixed(2) });
  } catch (err) {
    next(err);
  }
}

async function summaryMonth(req, res, next) {
  try {
    const usuario_id = req.user.id;
    const year = req.query.year || new Date().getFullYear();
    const month = req.query.month || (new Date().getMonth() + 1);
    const [rows] = await pool.execute(
      `SELECT tipo, SUM(valor) as total FROM transacoes
       WHERE usuario_id = ? AND YEAR(data)=? AND MONTH(data)=?
       GROUP BY tipo`,
      [usuario_id, year, month]
    );
    const summary = { entrada: 0, saida: 0 };
    for (const r of rows) {
      summary[r.tipo] = Number(r.total).toFixed(2);
    }
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBalance, summaryMonth };
