const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false
});

async function atualizarConstraints() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Atualizando constraints para usar "concluido" sem acento...');
    
    await client.query('BEGIN');
    
    // 1. Remover constraints antigas da tabela agendamentos
    console.log('1. Removendo constraint antiga da tabela agendamentos...');
    await client.query(`
      ALTER TABLE agendamentos 
      DROP CONSTRAINT IF EXISTS agendamentos_status_check
    `);
    
    // 2. Adicionar nova constraint para tabela agendamentos
    console.log('2. Adicionando nova constraint para tabela agendamentos...');
    await client.query(`
      ALTER TABLE agendamentos 
      ADD CONSTRAINT agendamentos_status_check 
      CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    
    // 3. Remover constraints antigas da tabela logs_agendamentos
    console.log('3. Removendo constraints antigas da tabela logs_agendamentos...');
    await client.query(`
      ALTER TABLE logs_agendamentos 
      DROP CONSTRAINT IF EXISTS logs_agendamentos_status_anterior_check
    `);
    
    await client.query(`
      ALTER TABLE logs_agendamentos 
      DROP CONSTRAINT IF EXISTS logs_agendamentos_status_novo_check
    `);
    
    // 4. Adicionar novas constraints para logs_agendamentos
    console.log('4. Adicionando novas constraints para logs_agendamentos...');
    await client.query(`
      ALTER TABLE logs_agendamentos 
      ADD CONSTRAINT logs_agendamentos_status_anterior_check 
      CHECK (status_anterior IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    
    await client.query(`
      ALTER TABLE logs_agendamentos 
      ADD CONSTRAINT logs_agendamentos_status_novo_check 
      CHECK (status_novo IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'não compareceu'))
    `);
    
    // 5. Atualizar dados existentes (se houver)
    console.log('5. Atualizando dados existentes...');
    const updateAgendamentos = await client.query(`
      UPDATE agendamentos 
      SET status = 'concluido' 
      WHERE status = 'concluído'
    `);
    console.log(`   - Agendamentos atualizados: ${updateAgendamentos.rowCount}`);
    
    const updateLogsAnterior = await client.query(`
      UPDATE logs_agendamentos 
      SET status_anterior = 'concluido' 
      WHERE status_anterior = 'concluído'
    `);
    console.log(`   - Logs (status_anterior) atualizados: ${updateLogsAnterior.rowCount}`);
    
    const updateLogsNovo = await client.query(`
      UPDATE logs_agendamentos 
      SET status_novo = 'concluido' 
      WHERE status_novo = 'concluído'
    `);
    console.log(`   - Logs (status_novo) atualizados: ${updateLogsNovo.rowCount}`);
    
    await client.query('COMMIT');
    
    console.log('\n✅ Constraints atualizadas com sucesso!');
    
    // 6. Testar inserção
    console.log('\n🧪 Testando inserção com novo status...');
    try {
      await client.query(`
        INSERT INTO logs_agendamentos 
        (agendamento_id, status_anterior, status_novo, alterado_por, data_agendada, hora_agendada, cliente_nome) 
        VALUES (997, 'confirmado', 'concluido', 'teste', '2025-07-22', '10:00:00', 'Teste Constraint')
      `);
      
      console.log('✅ Inserção de teste funcionou!');
      
      // Limpar teste
      await client.query('DELETE FROM logs_agendamentos WHERE agendamento_id = 997');
      console.log('🗑️ Dados de teste removidos');
      
    } catch (err) {
      console.log('❌ Erro no teste:', err.message);
    }
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao atualizar constraints:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

atualizarConstraints();
