const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false
});

async function corrigirDados() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Corrigindo dados existentes no banco...');
    
    await client.query('BEGIN');
    
    // 1. Verificar dados atuais
    console.log('\n1. Verificando dados atuais...');
    
    const agendamentosComAcento = await client.query(`
      SELECT id, status FROM agendamentos 
      WHERE status = 'concluído'
    `);
    console.log(`   - Agendamentos com "concluído": ${agendamentosComAcento.rowCount}`);
    
    const logsComAcentoAnterior = await client.query(`
      SELECT id, status_anterior FROM logs_agendamentos 
      WHERE status_anterior = 'concluído'
    `);
    console.log(`   - Logs com status_anterior "concluído": ${logsComAcentoAnterior.rowCount}`);
    
    const logsComAcentoNovo = await client.query(`
      SELECT id, status_novo FROM logs_agendamentos 
      WHERE status_novo = 'concluído'
    `);
    console.log(`   - Logs com status_novo "concluído": ${logsComAcentoNovo.rowCount}`);
    
    // 2. Atualizar dados existentes
    console.log('\n2. Atualizando dados existentes...');
    
    const updateAgendamentos = await client.query(`
      UPDATE agendamentos 
      SET status = 'concluido' 
      WHERE status = 'concluído'
    `);
    console.log(`   ✅ Agendamentos atualizados: ${updateAgendamentos.rowCount}`);
    
    const updateLogsAnterior = await client.query(`
      UPDATE logs_agendamentos 
      SET status_anterior = 'concluido' 
      WHERE status_anterior = 'concluído'
    `);
    console.log(`   ✅ Logs (status_anterior) atualizados: ${updateLogsAnterior.rowCount}`);
    
    const updateLogsNovo = await client.query(`
      UPDATE logs_agendamentos 
      SET status_novo = 'concluido' 
      WHERE status_novo = 'concluído'
    `);
    console.log(`   ✅ Logs (status_novo) atualizados: ${updateLogsNovo.rowCount}`);
    
    await client.query('COMMIT');
    
    console.log('\n✅ Dados corrigidos com sucesso!');
    
    // 3. Verificar se ainda há dados com acento
    console.log('\n3. Verificação final...');
    
    const verificacao1 = await client.query(`
      SELECT COUNT(*) as count FROM agendamentos 
      WHERE status = 'concluído'
    `);
    console.log(`   - Agendamentos ainda com "concluído": ${verificacao1.rows[0].count}`);
    
    const verificacao2 = await client.query(`
      SELECT COUNT(*) as count FROM logs_agendamentos 
      WHERE status_anterior = 'concluído' OR status_novo = 'concluído'
    `);
    console.log(`   - Logs ainda com "concluído": ${verificacao2.rows[0].count}`);
    
    if (verificacao1.rows[0].count === '0' && verificacao2.rows[0].count === '0') {
      console.log('\n🎉 Todos os dados foram corrigidos! Agora as constraints podem ser atualizadas.');
    } else {
      console.log('\n⚠️ Ainda há dados com acento que precisam ser corrigidos.');
    }
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao corrigir dados:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

corrigirDados();
