const fs = require('fs');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupLogin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  let client;
  try {
    // Ler o arquivo SQL
    const sql = fs.readFileSync('./setup-login.sql', 'utf8');
    
    // Conectar ao banco de dados
    client = await pool.connect();
    
    console.log('Configurando sistema de login...');
    
    // Executar o script SQL (sem o INSERT temporário)
    const sqlWithoutInsert = sql.replace(/INSERT INTO administradores.*ON CONFLICT.*DO NOTHING;/s, '');
    await client.query(sqlWithoutInsert);
    
    // Gerar hash da senha padrão
    const senhaOriginal = 'admin123';
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senhaOriginal, saltRounds);
    
    // Inserir administrador com senha hashada
    await client.query(
      `INSERT INTO administradores (nome, email, senha_hash, nivel_acesso) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         senha_hash = EXCLUDED.senha_hash,
         alterado_em = CURRENT_TIMESTAMP`,
      ['Admin do Além', 'admin@barbeariadoalem.com', senhaHash, 'super_admin']
    );
    
    console.log('✅ Sistema de login configurado com sucesso!');
    console.log('📋 Credenciais padrão:');
    console.log('   Email: admin@barbeariadoalem.com');
    console.log('   Senha: admin123');
    console.log('⚠️  IMPORTANTE: Altere estas credenciais em produção!');
    
    // Verificar se as tabelas foram criadas
    const tabelas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('administradores', 'logs_login', 'sessoes_admin')
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas criadas:');
    tabelas.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (err) {
    console.error('❌ Erro ao configurar sistema de login:', err.message);
    throw err;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupLogin().catch(console.error);
}

module.exports = setupLogin;
