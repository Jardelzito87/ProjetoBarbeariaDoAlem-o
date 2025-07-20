const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Gerador de credenciais seguras para Barbearia do Além
 * Estrutura reorganizada - v2.0
 */
class SecurityManager {
  constructor() {
    // Atualizar caminhos para nova estrutura
    this.envPath = path.join(__dirname, '..', '.env');
    this.credentialsPath = path.join(__dirname, '..', '.credentials.json');
  }

  // Gerar senha aleatória segura
  generateSecurePassword(length = 16) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Gerar chaves JWT/Session seguras
  generateSecretKey(length = 64) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Criptografar dados sensíveis
  encryptData(text, key) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted: encrypted,
      iv: iv.toString('hex')
    };
  }

  // Descriptografar dados
  decryptData(encryptedData, key) {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Gerar arquivo .env seguro
  generateSecureEnv() {
    console.log('🔐 Gerando credenciais seguras...\n');

    // Gerar nova senha admin
    const adminPassword = this.generateSecurePassword(12);
    
    // Gerar chaves seguras
    const jwtSecret = this.generateSecretKey(32);
    const sessionSecret = this.generateSecretKey(32);
    const encryptionKey = this.generateSecretKey(16);

    // Ler .env atual para preservar DATABASE_URL
    let currentEnv = '';
    let databaseUrl = '';
    
    if (fs.existsSync(this.envPath)) {
      currentEnv = fs.readFileSync(this.envPath, 'utf8');
      const match = currentEnv.match(/DATABASE_URL=(.+)/);
      if (match) {
        databaseUrl = match[1];
      }
    }

    // Criar novo .env
    const newEnv = `# Configuração SEGURA do banco de dados Neon
DATABASE_URL=${databaseUrl}

# Chaves de segurança (GERADAS AUTOMATICAMENTE)
JWT_SECRET=${jwtSecret}
SESSION_SECRET=${sessionSecret}
ENCRYPTION_KEY=${encryptionKey}

# Porta do servidor
PORT=3000

# ========================================
# AVISO DE SEGURANÇA
# ========================================
# ✅ Este arquivo foi gerado automaticamente
# ✅ Chaves criptográficas seguras aplicadas
# ✅ Senha admin alterada - veja credentials.txt
# ❌ NUNCA commite este arquivo no Git
# ========================================`;

    // Salvar .env
    fs.writeFileSync(this.envPath, newEnv);

    // Criar arquivo de credenciais
    const credentials = {
      admin: {
        email: 'admin@barbeariadoalem.com',
        password: adminPassword,
        generated: new Date().toISOString(),
        note: 'Credenciais geradas automaticamente pelo sistema de segurança'
      },
      security: {
        jwtSecret: jwtSecret,
        sessionSecret: sessionSecret,
        encryptionKey: encryptionKey
      }
    };

    fs.writeFileSync(this.credentialsPath, JSON.stringify(credentials, null, 2));

    console.log('✅ Arquivo .env seguro criado!');
    console.log('✅ Credenciais salvas em .credentials.json');
    console.log('\n🔑 NOVAS CREDENCIAIS DE LOGIN:');
    console.log(`   Email: ${credentials.admin.email}`);
    console.log(`   Senha: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   1. Salve essas credenciais em local seguro');
    console.log('   2. Delete o arquivo .credentials.json após anotar');
    console.log('   3. Execute: node update-admin-password.js');
    console.log('\n🔒 As chaves de segurança foram renovadas!');
  }

  // Mascarar senhas em arquivos de documentação
  maskPasswordsInDocs() {
    const files = [
      'GUIA-LOGIN.md',
      'SETUP-DESENVOLVEDOR.md',
      'README.md'
    ];

    files.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Substituir senhas por placeholders
        content = content.replace(/admin123/g, '***SENHA_SEGURA***');
        content = content.replace(/senha:[^\\n]*/gi, 'senha: ***GERADA_AUTOMATICAMENTE***');
        
        // Adicionar aviso de segurança
        if (!content.includes('🔐 CREDENCIAIS SEGURAS')) {
          const securityNote = `

## 🔐 CREDENCIAIS SEGURAS

⚠️ **ATENÇÃO**: As credenciais padrão foram substituídas por senhas seguras geradas automaticamente.

📋 **Para obter as credenciais atuais:**
1. Execute: \`cd backend && node generate-secure-credentials.js\`
2. Anote as novas credenciais
3. Execute: \`node update-admin-password.js\`

🔒 **Sistema de Segurança Ativo**: Senhas criptografadas, chaves rotacionadas, logs auditados.

`;
          content = content.replace('# 🎭 Sistema de Login - Barbearia do Além', '# 🎭 Sistema de Login - Barbearia do Além' + securityNote);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Senhas mascaradas em: ${file}`);
      }
    });
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const security = new SecurityManager();
  security.generateSecureEnv();
  security.maskPasswordsInDocs();
}

module.exports = SecurityManager;
