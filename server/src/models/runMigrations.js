// server/src/models/runMigrations.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    // conectar sem database para criar DB (já no script SQL criamos DB)
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // split e executar statements sequencialmente (mais robusto)
    const stmts = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const s of stmts) {
      await conn.query(s);
    }
    console.log('Migrations executadas com sucesso.');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao executar migrations:', err);
    process.exit(1);
  }
}

run();
