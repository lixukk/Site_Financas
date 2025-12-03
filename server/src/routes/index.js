// server/src/routes/index.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const transactionController = require('../controllers/transactionController');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/auth');

// auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// categories (protected for create, list public authenticated)
router.get('/categories', authMiddleware, categoryController.listCategories);
router.post('/categories', authMiddleware, categoryController.createCategory);

// transactions
router.post('/transactions', authMiddleware, transactionController.createTransaction);
router.get('/transactions', authMiddleware, transactionController.listTransactions);
router.get('/transactions/:id', authMiddleware, transactionController.getTransaction);
router.put('/transactions/:id', authMiddleware, transactionController.updateTransaction);
router.delete('/transactions/:id', authMiddleware, transactionController.deleteTransaction);

// dashboard
router.get('/dashboard/balance', authMiddleware, dashboardController.getBalance);
router.get('/dashboard/summary', authMiddleware, dashboardController.summaryMonth);

module.exports = router;
