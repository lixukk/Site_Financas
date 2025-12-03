// server/src/controllers/authController.js
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'nome, email e senha são obrigatórios' });

    const exists = await userModel.findByEmail(email);
    if (exists) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const senhaHash = await hashPassword(senha);
    const user = await userModel.createUser({ nome, email, senhaHash });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'email e senha são obrigatórios' });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await comparePassword(senha, user.senha);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    // criar token
    const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
