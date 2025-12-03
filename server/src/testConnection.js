const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "0000",
      database: "financas_app"
    });

    console.log("✅ Conexão com MySQL bem-sucedida!");

    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    console.log("Resultado do teste:", rows);

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao conectar ao MySQL:", error);
  }
}

testConnection();
