// server/src/models/runSeeds.js
const pool = require('../config/db');
async function seed() {
  try {
    // categorias padrão
    const categories = [
      ['Salário', 'entrada'],
      ['Investimentos', 'entrada'],
      ['Alimentação', 'saida'],
      ['Transporte', 'saida'],
      ['Lazer', 'saida'],
      ['Outros', 'saida']
    ];

    for (const [nome, tipo] of categories) {
      await pool.execute(
        `INSERT INTO categorias (nome, tipo) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome=? AND tipo=?) LIMIT 1`,
        [nome, tipo, nome, tipo]
      );
    }

    console.log('Seeds executadas.');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}
seed();
