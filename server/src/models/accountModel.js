// server/src/models/accountModel.js
const db = require('../db');

async function createAccount({ user_id, name, balance = 0, currency = 'BRL' }) {
  const sql = `INSERT INTO accounts (user_id, name, balance, currency) VALUES (?, ?, ?, ?)`;
  const result = await db.query(sql, [user_id, name, balance, currency]);
  return { id: result.insertId };
}

async function getAccountsByUser(user_id) {
  const sql = `SELECT id, name, balance, currency, created_at FROM accounts WHERE user_id = ?`;
  return await db.query(sql, [user_id]);
}

async function getAccountById(id) {
  const sql = `SELECT * FROM accounts WHERE id = ?`;
  const rows = await db.query(sql, [id]);
  return rows[0] || null;
}

async function updateBalance(id, newBalance) {
  const sql = `UPDATE accounts SET balance = ? WHERE id = ?`;
  await db.query(sql, [newBalance, id]);
  return true;
}

module.exports = { createAccount, getAccountsByUser, getAccountById, updateBalance };
