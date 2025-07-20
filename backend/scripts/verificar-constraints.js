const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false
});

async function verificarConstraints() {
  try {
    console.log('🔍 Verificando constraints completas...');
    
    const query = `
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_schema = 'public' 
      AND constraint_name LIKE '%logs_agendamentos%status%'
    `;
    
    const result = await pool.query(query);
    
    console.log('\n📋 Constraints da tabela logs_agendamentos:');
    for (const row of result.rows) {
      console.log(`\nConstraint: ${row.constraint_name}`);
      console.log(`Clause: ${row.check_clause}`);
    }
    
    // Testar diferentes versões do status
    console.log('\n🧪 Testando diferentes versões de "concluído":');
    
    const versoes = [
      'concluido',     // sem acento
      'concluído',     // com acento agudo
      'concluido'      // ASCII puro
    ];
    
    for (const versao of versoes) {
      console.log(`\nTestando: "${versao}"`);
      console.log(`Bytes UTF-8: [${Buffer.from(versao, 'utf8').join(', ')}]`);
      
      try {
        await pool.query(`
          INSERT INTO logs_agendamentos 
          (agendamento_id, status_anterior, status_novo, alterado_por, data_agendada, hora_agendada, cliente_nome) 
          VALUES (998, 'confirmado', $1, 'teste', '2025-07-22', '10:00:00', 'Teste')
        `, [versao]);
        
        console.log('✅ SUCESSO - Esta versão funciona!');
        
        // Limpar
        await pool.query('DELETE FROM logs_agendamentos WHERE agendamento_id = 998');
        break;
        
      } catch (err) {
        console.log('❌ ERRO - Esta versão não funciona');
      }
    }
    
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await pool.end();
  }
}

verificarConstraints();
