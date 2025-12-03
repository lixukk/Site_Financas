// server/src/routes/api.js
const express = require('express');
const router = express.Router();
const accountModel = require('../models/accountModel');

// Criar conta
router.post('/accounts', async (req, res, next) => {
  try {
    const { user_id, name, balance, currency } = req.body;
    if (!user_id || !name) return res.status(400).json({ error: 'user_id e name obrigatórios' });
    const acc = await accountModel.createAccount({ user_id, name, balance, currency });
    res.status(201).json(acc);
  } catch (err) {
    next(err);
  }
});

// Listar contas por usuário
router.get('/users/:userId/accounts', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const accounts = await accountModel.getAccountsByUser(userId);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

// Obter conta
router.get('/accounts/:id', async (req, res, next) => {
  try {
    const acc = await accountModel.getAccountById(Number(req.params.id));
    if (!acc) return res.status(404).json({ error: 'Conta não encontrada' });
    res.json(acc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
