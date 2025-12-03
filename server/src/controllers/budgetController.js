// server/src/controllers/budgetController.js
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

async function setBudget(req, res, next) {
  try {
    const { categoria_id, valor } = req.body;
    const usuario_id = req.user.id;

    // Upsert: Cria ou Atualiza se já existir para este User+Categoria
    await Budget.findOneAndUpdate(
      { user: usuario_id, category: categoria_id },
      { valor },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Orçamento salvo' });
  } catch (err) {
    next(err);
  }
}

async function listBudgets(req, res, next) {
  try {
    const usuario_id = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Buscamos todos os orçamentos do usuário e preenchemos os dados da categoria
    const budgets = await Budget.find({ user: usuario_id }).populate('category', 'nome');

    // Para cada orçamento, calculamos quanto foi gasto neste mês naquela categoria
    const result = await Promise.all(budgets.map(async (b) => {
      // Agrega as transações de SAÍDA desta categoria neste mês
      const gastos = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(usuario_id),
            category: b.category._id, // ID da categoria do orçamento
            tipo: 'saida',
            data: { $gte: startOfMonth, $lt: endOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: "$valor" } } }
      ]);

      const gastoAtual = gastos.length > 0 ? gastos[0].total : 0;

      return {
        categoria_id: b.category._id,
        categoria_nome: b.category.nome,
        limite: b.valor,
        gasto_atual: gastoAtual
      };
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function deleteBudget(req, res, next) {
  try {
    const { id } = req.params; // ID da categoria vindo da URL
    const usuario_id = req.user.id;
    
    // Remove o orçamento onde user é o atual E a categoria é o ID passado
    await Budget.findOneAndDelete({ user: usuario_id, category: id });
    
    res.json({ message: 'Orçamento removido' });
  } catch (err) {
    next(err);
  }
}

module.exports = { setBudget, listBudgets, deleteBudget };