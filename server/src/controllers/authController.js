// server/src/controllers/authController.js
const User = require('../models/User'); // Importa o Modelo Mongoose
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

    // Verifica se já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ error: 'E-mail já cadastrado' });

    // Cria usuário
    const senhaHash = await hashPassword(senha);
    const user = await User.create({ nome, email, senha: senhaHash });

    res.status(201).json({ id: user._id, nome: user.nome, email: user.email });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    
    // Busca usuário
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Verifica senha
    const ok = await comparePassword(senha, user.senha);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Gera token
    const token = jwt.sign({ id: user._id, email: user.email, nome: user.nome });
    
    res.json({ token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };