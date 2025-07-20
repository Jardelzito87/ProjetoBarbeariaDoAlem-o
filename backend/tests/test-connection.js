const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Tentando conectar ao banco de dados...');
    const client = await pool.connect();
    console.log('Conexão estabelecida com sucesso!');
    
    // Testar consulta simples
    const result = await client.query('SELECT NOW() as time');
    console.log('Hora do servidor:', result.rows[0].time);
    
    // Listar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTabelas existentes:');
    if (tables.rows.length === 0) {
      console.log('Nenhuma tabela encontrada.');
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    client.release();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } finally {
    await pool.end();
  }
}

testConnection();