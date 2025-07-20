# 🎭 Sistema de Login - Barbearia do Além

## 🔐 CREDENCIAIS SEGURAS

⚠️ **ATENÇÃO**: As credenciais padrão foram substituídas por senhas seguras geradas automaticamente.

📋 **Para obter as credenciais atuais:**
1. Execute: `cd backend && node generate-secure-credentials.js`
2. Anote as novas credenciais
3. Execute: `node update-admin-password.js`

🔒 **Sistema de Segurança Ativo**: Senhas criptografadas, chaves rotacionadas, logs auditados.



## 🚀 Início Rápido

### Passo 1: Inicializar o Sistema
Execute o script `start-sistema-login.bat` ou use os comandos:

```bash
# Backend (Pasta /backend)
cd backend
npm install  # Primeira vez apenas
node server.js

# Frontend (Pasta raiz)
npm install  # Primeira vez apenas
ng serve
```

### Passo 2: Acessar o Sistema
- **Site Principal**: http://localhost:4200
- **Login Admin**: http://localhost:4200/login
- **Painel Admin**: http://localhost:4200/admin (protegido)

### Passo 3: Credenciais Padrão
- **Email**: admin@barbeariadoalem.com
- **Senha**: ***SENHA_SEGURA***

⚠️ **IMPORTANTE**: Altere estas credenciais em produção!

---

## 🔐 Fluxo de Autenticação

### 1. Login
- Acesse `/login`
- Digite as credenciais
- Sistema validará via JWT
- Redirecionamento automático para `/admin`

### 2. Painel Admin (Protegido)
- Acesso somente com login válido
- Guard do Angular protege a rota
- Logout disponível no menu do usuário
- Sessão expira em 24h

### 3. Logout
- Clique no menu do usuário (canto superior direito)
- Clique em "Sair"
- Redirecionamento para página de login

### 4. Deslogamento Automático
- **Ao reiniciar o servidor**: Todas as sessões ativas são invalidadas
- **Detecção no frontend**: Sistema detecta token inválido automaticamente
- **Logout automático**: Usuario é deslogado e redirecionado para login
- **Prevenção de login duplo**: Apenas uma sessão ativa por admin

---

## 🛡️ Recursos de Segurança

### Backend (Node.js + JWT)
- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Middleware de autenticação
- ✅ Proteção de rotas sensíveis
- ✅ Logs de login e ações
- ✅ Conexão segura com PostgreSQL (Neon)
- ✅ **Deslogamento automático ao reiniciar servidor**
- ✅ **Prevenção de login múltiplo simultâneo**

### Frontend (Angular + Guards)
- ✅ AuthGuard protege rota admin
- ✅ AuthService gerencia estado
- ✅ Token armazenado localmente
- ✅ Redirecionamentos automáticos
- ✅ Validação de formulários
- ✅ Interface responsiva
- ✅ **Detecção automática de sessão invalidada**

---

## 🗄️ Banco de Dados

### Tabelas de Autenticação
```sql
-- Administradores
administradores (id, nome, email, senha_hash, criado_em)

-- Logs de Login
logs_login (id, admin_id, ip, user_agent, sucesso, tentativa_em)

-- Sessões Admin
sessoes_admin (id, admin_id, token_hash, expires_at, criado_em)
```

### Scripts Úteis
```bash
# Criar tabelas de login
node backend/setup-login.js

# Testar conexão
node backend/test-connection.js

# Verificar tabelas
node backend/check-tables.js
```

---

## 🔧 Troubleshooting

### Problema: Backend não conecta
```bash
# Verificar .env
cat backend/.env

# Testar conexão
cd backend && node test-connection.js
```

### Problema: Frontend não carrega
```bash
# Reinstalar dependências
npm install

# Verificar porta
netstat -an | findstr ":4200"
```

### Problema: Login não funciona
```bash
# Verificar backend rodando
netstat -an | findstr ":3000"

# Verificar logs do backend
# Console mostrará tentativas de login
```

### Problema: Admin não é criado
```bash
# Executar setup
cd backend && node setup-login.js

# Verificar se admin existe
# Será exibido no console
```

### Problema: Botão "Atualizar Status" não funciona
```bash
# ✅ PROBLEMA RESOLVIDO!
# Executar script com correção final
teste-botao-funcionando.bat

# O problema era incompatibilidade de encoding:
# ❌ Código usava: "concluído" (com acento)  
# ✅ Banco esperava: "concluido" (sem acento)

# 🔧 CORREÇÕES APLICADAS:
# - 7 agendamentos atualizados no banco
# - Constraints recriadas corretamente
# - Frontend e backend sincronizados
# - Status "concluído" → "concluido" (sem acento)

# Verificar se está logado
# F12 -> Console -> Procurar por "Token não encontrado"

# Verificar se backend responde
netstat -an | findstr ":3001"

# Testar rota específica
curl -X PATCH http://localhost:3001/api/agendamentos/1 
     -H "Authorization: Bearer SEU_TOKEN" 
     -H "Content-Type: application/json" 
     -d '{"status":"concluido"}'

# ✅ RESULTADO ESPERADO:
# - Status muda para "Concluído" sem erro
# - Logs detalhados no console do backend
# - Sem mensagens de erro no frontend

# Executar script de teste
teste-botao-status.bat

# ✅ CORREÇÃO APLICADA:
# - Conversão correta do ID para integer
# - Logs detalhados para debug
# - Tratamento melhorado de erros
# - Validação aprimorada de dados
```

---

## 📱 Telas do Sistema

### 1. Login (`/login`)
- Formulário de email/senha
- Validações em tempo real
- Feedback visual de erros
- Credenciais padrão exibidas
- Link para voltar ao site

### 2. Admin (`/admin`)
- Cabeçalho com info do usuário
- Menu dropdown com logout
- Painel completo de agendamentos
- Proteção por AuthGuard

### 3. Redirecionamentos
- `/admin` sem login → `/login`
- Login com sucesso → `/admin`
- Logout → `/login`

---

## 🚀 Produção

### Variáveis Importantes
```env
# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-jwt-super-segura
SESSION_SECRET=sua-chave-sessao-super-segura
PORT=3000
```

### Tarefas de Deploy
1. ✅ Alterar credenciais padrão
2. ✅ Configurar HTTPS (SSL)
3. ✅ Definir JWT_SECRET seguro
4. ✅ Configurar CORS corretamente
5. ✅ Backup das tabelas de admin

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs do console** (backend e frontend)
2. **Testar conexão** com banco de dados
3. **Verificar portas** em uso
4. **Reinstalar dependências** se necessário
5. **Usar scripts de troubleshooting**

**Scripts Disponíveis**:
- `start-sistema-login.bat` - Iniciar tudo
- `parar-sistema.bat` - Parar servidores
- `teste-deslogamento-automatico.bat` - Testar deslogamento ao reiniciar
- `teste-login-duplo.bat` - Testar prevenção de login múltiplo
- `teste-botao-status.bat` - Testar botão de atualizar status
- `corrigir-problema-login.bat` - Resolver problema "já está logado"
- `backend/setup-login.js` - Configurar login
- `backend/test-connection.js` - Testar banco

---

## 🎉 Sucesso!

Parabéns! Seu sistema de login está funcionando com:

✅ **Autenticação JWT segura**  
✅ **Interface moderna e responsiva**  
✅ **Proteção de rotas**  
✅ **Logs de auditoria**  
✅ **Integração com banco Neon**  
✅ **Deploy-ready**  

**Agora você pode proteger o acesso ao painel administrativo da Barbearia do Além!** 🎭✂️
