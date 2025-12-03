// server/src/controllers/dashboardController.js
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

async function getBalance(req, res, next) {
  try {
    const usuario_id = req.user.id;

    // Agregação para somar entradas e subtrair saídas
    const result = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(usuario_id) } },
      {
        $group: {
          _id: null,
          totalEntrada: {
            $sum: { $cond: [{ $eq: ["$tipo", "entrada"] }, "$valor", 0] }
          },
          totalSaida: {
            $sum: { $cond: [{ $eq: ["$tipo", "saida"] }, "$valor", 0] }
          }
        }
      }
    ]);

    const saldo = result.length > 0 ? (result[0].totalEntrada - result[0].totalSaida) : 0;
    
    res.json({ saldo: saldo.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

async function summaryMonth(req, res, next) {
  try {
    const usuario_id = req.user.id;
    const now = new Date();
    // Primeiro dia do mês atual
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Primeiro dia do próximo mês
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await Transaction.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(usuario_id),
          data: { $gte: startOfMonth, $lt: endOfMonth } // Filtra pelo mês atual
        } 
      },
      {
        $group: {
          _id: "$tipo", // Agrupa por 'entrada' ou 'saida'
          total: { $sum: "$valor" }
        }
      }
    ]);

    // Formata para o front-end: { entrada: "100.00", saida: "50.00" }
    const summary = { entrada: 0, saida: 0 };
    result.forEach(item => {
      summary[item._id] = item.total.toFixed(2);
    });

    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBalance, summaryMonth };