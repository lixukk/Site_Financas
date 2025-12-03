// server/src/controllers/transactionController.js
const Transaction = require('../models/Transaction');

// POST /transactions
async function createTransaction(req, res, next) {
  try {
    const { categoria_id, descricao, valor, tipo, data } = req.body;
    const usuario_id = req.user.id; 

    if (!categoria_id) return res.status(400).json({ error: 'Categoria é obrigatória' });

    const transaction = await Transaction.create({
      user: usuario_id,
      category: categoria_id,
      descricao,
      valor,
      tipo,
      data
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

// GET /transactions
async function listTransactions(req, res, next) {
  try {
    const usuario_id = req.user.id;
    
    const transactions = await Transaction.find({ user: usuario_id })
      .sort({ data: -1, createdAt: -1 })
      .populate('category', 'nome');

    const formatted = transactions.map(t => ({
      id: t._id,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      data: t.data,
      categoria_nome: t.category ? t.category.nome : 'Sem Categoria'
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
}

// GET /transactions/:id
async function getTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const transaction = await Transaction.findOne({ _id: id, user: usuario_id })
      .populate('category', 'nome');

    if (!transaction) return res.status(404).json({ error: 'Transação não encontrada' });

    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

// PUT /transactions/:id
async function updateTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;
    const { categoria_id, descricao, valor, tipo, data } = req.body;

    const transaction = await Transaction.findOne({ _id: id, user: usuario_id });

    if (!transaction) return res.status(404).json({ error: 'Transação não encontrada' });

    // Atualiza apenas os campos enviados
    if (categoria_id) transaction.category = categoria_id;
    if (descricao !== undefined) transaction.descricao = descricao;
    if (valor) transaction.valor = valor;
    if (tipo) transaction.tipo = tipo;
    if (data) transaction.data = data;

    await transaction.save();

    res.json({ message: 'Transação atualizada com sucesso', transaction });
  } catch (err) {
    next(err);
  }
}

// DELETE /transactions/:id
async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const deleted = await Transaction.findOneAndDelete({ _id: id, user: usuario_id });
    
    if (!deleted) return res.status(404).json({ error: 'Transação não encontrada' });

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};