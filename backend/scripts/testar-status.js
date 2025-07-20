const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false
});

async function testarStatusValues() {
  console.log('🔍 Testando valores de status permitidos...');
  
  try {
    // Testar constraints da tabela agendamentos
    console.log('\n1. Testando constraints da tabela AGENDAMENTOS:');
    const statusAgendamentos = ['pendente', 'confirmado', 'cancelado', 'concluído', 'não compareceu'];
    
    for (const status of statusAgendamentos) {
      console.log(`   Testando: "${status}"`);
      console.log(`   Bytes: [${Buffer.from(status, 'utf8').join(', ')}]`);
      console.log(`   Length: ${status.length} chars`);
    }
    
    // Testar constraints da tabela logs_agendamentos
    console.log('\n2. Verificando constraints da tabela LOGS_AGENDAMENTOS:');
    const queryConstraints = `
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_schema = 'public' 
      AND constraint_name LIKE '%logs_agendamentos%status%'
    `;
    
    const result = await pool.query(queryConstraints);
    console.log('   Constraints encontradas:', result.rows);
    
    // Testar inserção específica
    console.log('\n3. Testando inserção no logs_agendamentos:');
    
    // Primeiro vamos tentar cada status individualmente
    const statusParaTeste = 'concluído';
    console.log(`   Testando inserção com status: "${statusParaTeste}"`);
    
    try {
      const testInsert = `
        INSERT INTO logs_agendamentos 
        (agendamento_id, status_anterior, status_novo, alterado_por, data_agendada, hora_agendada, cliente_nome) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await pool.query(testInsert, [
        999, // ID de teste
        'confirmado',
        statusParaTeste,
        'teste',
        '2025-07-22',
        '10:00:00',
        'Cliente Teste'
      ]);
      
      console.log('   ✅ Inserção bem-sucedida!');
      
      // Remover o registro de teste
      await pool.query('DELETE FROM logs_agendamentos WHERE agendamento_id = 999');
      console.log('   🗑️ Registro de teste removido');
      
    } catch (err) {
      console.log('   ❌ Erro na inserção:', err.message);
      console.log('   📋 Detalhes:', err.detail);
    }
    
    // Verificar se há diferenças de encoding
    console.log('\n4. Verificando possíveis problemas de encoding:');
    const testStatuses = [
      'concluído',      // Pode ser que esta seja a versão correta
      'concluído',      // Ou esta
      'concluido'       // Ou esta sem acento
    ];
    
    for (const status of testStatuses) {
      console.log(`   "${status}" - Bytes: [${Buffer.from(status, 'utf8').join(', ')}]`);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  } finally {
    await pool.end();
  }
}

testarStatusValues();
