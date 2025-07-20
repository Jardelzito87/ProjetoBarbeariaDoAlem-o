const fs = require('fs');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configurar dotenv com caminho correto para nova estrutura  
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function updateAdminPassword() {
  // Verificar se existe arquivo de credenciais
  const credentialsPath = path.join(__dirname, '..', '.credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    console.log('❌ Arquivo de credenciais não encontrado!');
    console.log('   Execute primeiro: node security/generate-secure-credentials.js');
    return;
  }

  // Ler credenciais
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const novaSenha = credentials.admin.password;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  let client;
  try {
    client = await pool.connect();
    
    console.log('🔐 Atualizando senha do administrador...');
    
    // Gerar hash da nova senha
    const saltRounds = 12; // Aumentado para maior segurança
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);
    
    // Atualizar senha no banco
    const result = await client.query(
      `UPDATE administradores 
       SET senha_hash = $1, alterado_em = CURRENT_TIMESTAMP
       WHERE email = 'admin@barbeariadoalem.com'
       RETURNING id, nome, email`,
      [senhaHash]
    );

    if (result.rowCount > 0) {
      console.log('✅ Senha atualizada com sucesso!');
      console.log(`   Admin: ${result.rows[0].nome}`);
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   Nova senha: ${novaSenha}`);
      
      // Registrar log de segurança
      await client.query(
        `INSERT INTO logs_login (admin_id, ip, user_agent, sucesso, tentativa_em, observacoes)
         VALUES ($1, '127.0.0.1', 'Sistema-Atualizacao-Senha', true, CURRENT_TIMESTAMP, 'Senha atualizada por script de segurança')`,
        [result.rows[0].id]
      );
      
      console.log('\n🔒 IMPORTANTE:');
      console.log('   1. Anote a nova senha em local seguro');
      console.log('   2. Delete o arquivo .credentials.json');
      console.log('   3. Teste o login no sistema');
      
      // Perguntar se deve deletar o arquivo
      console.log('\n⚠️  Deseja deletar o arquivo .credentials.json? (recomendado)');
      console.log('   Digite "sim" para deletar ou qualquer tecla para manter:');
      
      process.stdin.once('data', (data) => {
        const resposta = data.toString().trim().toLowerCase();
        if (resposta === 'sim' || resposta === 's' || resposta === 'yes') {
          fs.unlinkSync(credentialsPath);
          console.log('✅ Arquivo .credentials.json deletado com segurança!');
        } else {
          console.log('⚠️  Arquivo mantido. Lembre-se de deletá-lo manualmente!');
        }
        process.exit(0);
      });
      
    } else {
      console.log('❌ Nenhum administrador encontrado com o email especificado');
    }
    
  } catch (err) {
    console.error('❌ Erro ao atualizar senha:', err);
  } finally {
    if (client) client.release();
    pool.end();
  }
}

updateAdminPassword();
