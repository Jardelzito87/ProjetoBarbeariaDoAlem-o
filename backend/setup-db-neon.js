const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  let client;
  try {
    console.log('Conectando ao banco de dados Neon...');
    client = await pool.connect();
    console.log('Conexão estabelecida com sucesso!');
    
    // Ler o arquivo SQL
    const sql = fs.readFileSync('./init-db.sql', 'utf8');
    console.log('Arquivo SQL lido com sucesso.');
    
    // Executar o script SQL
    console.log('Executando script SQL...');
    await client.query(sql);
    console.log('Script SQL executado com sucesso!');
    
    // Verificar tabelas criadas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\nTabelas criadas:');
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Verificar serviços inseridos
    const servicos = await client.query('SELECT * FROM servicos');
    console.log('\nServiços inseridos:');
    servicos.rows.forEach(servico => {
      console.log(`- ${servico.id}: ${servico.nome} (R$ ${servico.preco})`);
    });
    
    console.log('\nBanco de dados configurado com sucesso!');
  } catch (err) {
    console.error('Erro ao configurar o banco de dados:', err);
    if (err.detail) {
      console.error('Detalhes do erro:', err.detail);
    }
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

setupDatabase();