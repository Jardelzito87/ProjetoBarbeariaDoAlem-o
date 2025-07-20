const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false
});

async function corrigirStatusCompleto() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Correção completa do status "concluído" -> "concluido"...');
    
    await client.query('BEGIN');
    
    // 1. Remover TODAS as constraints temporariamente
    console.log('\n1. Removendo constraints temporariamente...');
    
    // Constraints da tabela agendamentos
    try {
      await client.query(`ALTER TABLE agendamentos DROP CONSTRAINT IF EXISTS agendamentos_status_check`);
      console.log('   ✅ Constraint agendamentos_status_check removida');
    } catch (err) {
      console.log('   ⚠️ Constraint agendamentos_status_check não encontrada');
    }
    
    // Constraints da tabela logs_agendamentos
    try {
      await client.query(`ALTER TABLE logs_agendamentos DROP CONSTRAINT IF EXISTS logs_agendamentos_status_anterior_check`);
      console.log('   ✅ Constraint logs_agendamentos_status_anterior_check removida');
    } catch (err) {
      console.log('   ⚠️ Constraint logs_agendamentos_status_anterior_check não encontrada');
    }
    
    try {
      await client.query(`ALTER TABLE logs_agendamentos DROP CONSTRAINT IF EXISTS logs_agendamentos_status_novo_check`);
      console.log('   ✅ Constraint logs_agendamentos_status_novo_check removida');
    } catch (err) {
      console.log('   ⚠️ Constraint logs_agendamentos_status_novo_check não encontrada');
    }
    
    // 2. Atualizar dados na tabela agendamentos
    console.log('\n2. Atualizando tabela agendamentos...');
    const updateAgendamentos = await client.query(`
      UPDATE agendamentos 
      SET status = 'concluido' 
      WHERE status = 'concluído'
    `);
    console.log(`   ✅ ${updateAgendamentos.rowCount} agendamentos atualizados`);
    
    // 3. Atualizar dados na tabela logs_agendamentos
    console.log('\n3. Atualizando tabela logs_agendamentos...');
    const updateLogsAnterior = await client.query(`
      UPDATE logs_agendamentos 
      SET status_anterior = 'concluido' 
      WHERE status_anterior = 'concluído'
    `);
    console.log(`   ✅ ${updateLogsAnterior.rowCount} logs (status_anterior) atualizados`);
    
    const updateLogsNovo = await client.query(`
      UPDATE logs_agendamentos 
      SET status_novo = 'concluido' 
      WHERE status_novo = 'concluído'
    `);
    console.log(`   ✅ ${updateLogsNovo.rowCount} logs (status_novo) atualizados`);
    
    // 4. Recriar constraints com os valores corretos
    console.log('\n4. Recriando constraints com valores corretos...');
    
    await client.query(`
      ALTER TABLE agendamentos 
      ADD CONSTRAINT agendamentos_status_check 
      CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    console.log('   ✅ Constraint agendamentos_status_check recriada');
    
    await client.query(`
      ALTER TABLE logs_agendamentos 
      ADD CONSTRAINT logs_agendamentos_status_anterior_check 
      CHECK (status_anterior IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    console.log('   ✅ Constraint logs_agendamentos_status_anterior_check recriada');
    
    await client.query(`
      ALTER TABLE logs_agendamentos 
      ADD CONSTRAINT logs_agendamentos_status_novo_check 
      CHECK (status_novo IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    console.log('   ✅ Constraint logs_agendamentos_status_novo_check recriada');
    
    await client.query('COMMIT');
    
    console.log('\n✅ Correção completa finalizada!');
    
    // 5. Teste final
    console.log('\n5. Teste final...');
    try {
      await client.query(`
        INSERT INTO logs_agendamentos 
        (agendamento_id, status_anterior, status_novo, alterado_por, data_agendada, hora_agendada, cliente_nome) 
        VALUES (996, 'confirmado', 'concluido', 'teste-final', '2025-07-22', '10:00:00', 'Teste Final')
      `);
      
      console.log('   ✅ Teste de inserção funcionou perfeitamente!');
      
      // Limpar teste
      await client.query('DELETE FROM logs_agendamentos WHERE agendamento_id = 996');
      console.log('   🗑️ Dados de teste removidos');
      
    } catch (err) {
      console.log('   ❌ Erro no teste final:', err.message);
    }
    
    console.log('\n🎉 CORREÇÃO COMPLETA! O botão "Feito" agora deve funcionar.');
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na correção:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

corrigirStatusCompleto();
