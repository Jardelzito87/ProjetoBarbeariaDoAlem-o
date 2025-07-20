# � Barbearia do Além - Sistema Completo de Agendamento

Sistema profissional de agendamentos desenvolvido com **Angular** + **Node.js** + **PostgreSQL**. Estrutura modular, segurança avançada e interface moderna.

---

## 🚀 Setup Rápido (3 comandos)

```bash
# 1. Instalar todas as dependências
npm run setup

# 2. Iniciar sistema completo  
npm run dev

# 3. Acessar aplicação
# Frontend: http://localhost:4200
# Backend API: http://localhost:3000/docs
```

---

## 📁 Estrutura Reorganizada (v2.0)

```
🏪 ProjetoBarbeariaDoAlem-o-8/
├── � package.json                    # Monorepo - Workspaces
├── 🚀 start.bat                       # Inicializador rápido
├── 📊 status.bat                      # Verificador de sistema
│
├── 📂 frontend/                       # 🎨 FRONTEND ANGULAR
│   ├── src/                           # Código Angular
│   │   ├── app/                       # Componentes da aplicação
│   │   ├── assets/css/loading.css     # CSS do loading screen
│   │   └── index.html                 # Template principal
│   ├── angular.json                   # Configurações Angular
│   └── package.json                   # Dependências frontend
│
├── 📂 backend/                        # 🔧 BACKEND NODE.JS
│   ├── 📂 src/                        # 🎯 Código principal
│   │   ├── server.js                  # Servidor Express
│   │   ├── database.js                # Pool PostgreSQL
│   │   └── paths.js                   # Sistema de caminhos
│   ├── 📂 config/                     # ⚙️ Configurações
│   │   └── index.js                   # Config centralizada
│   ├── 📂 database/                   # 🗄️ Scripts de BD
│   │   ├── *.sql                      # Schemas e migrações
│   │   ├── setup-db-neon.js           # Setup Neon
│   │   └── initialize-data.js         # Dados iniciais
│   ├── 📂 security/                   # 🔒 Segurança
│   │   ├── generate-secure-credentials.js
│   │   └── update-admin-password.js
│   ├── 📂 tests/                      # 🧪 Testes
│   │   └── test-connection.js
│   ├── � public/                     # 🌐 Arquivos estáticos
│   │   ├── api-docs.html              # Documentação API
│   │   └── css/api-docs.css           # Estilos da doc
│   └── package.json                   # Dependências backend
│
└── 📂 scripts/                        # 🛠️ Automação
    ├── start-frontend.bat             # Iniciar só frontend
    ├── start-backend.bat              # Iniciar só backend
    └── parar-sistema.bat              # Parar todos processos
```

---

## 🌐 Acesso ao Sistema

| **Serviço** | **URL** | **Função** |
|-------------|---------|------------|
| 🎨 **Frontend** | http://localhost:4200 | Aplicação principal |
| 🔐 **Login Admin** | http://localhost:4200/login | Autenticação |
| 👨‍💼 **Painel Admin** | http://localhost:4200/admin | Gestão do sistema |
| 📡 **API Backend** | http://localhost:3000 | Redirecionamento automático |
| 📚 **Documentação** | http://localhost:3000/docs | Info da API |

### � **Credenciais de Acesso**
```
📧 Email: admin@barbeariadoalem.com
🔑 Senha: Gerada automaticamente (ver backend/.credentials.json)
```

---

## ⚡ Comandos Principais

### 🔧 **Setup e Instalação**
```bash
npm run setup              # Setup completo (deps + segurança)
npm run install:all        # Instalar dependências
npm run install:frontend   # Só frontend
npm run install:backend    # Só backend
```

### 🚀 **Desenvolvimento**
```bash
npm run dev                # Frontend + Backend simultaneamente
npm run dev:frontend       # Só frontend (porta 4200)
npm run dev:backend        # Só backend (porta 3000)
npm start                  # Inicializador rápido
```

### 🏭 **Produção**
```bash
npm run build              # Build frontend para produção
npm run start:prod         # Backend em modo produção
```

### 🔒 **Segurança**
```bash
npm run security:update    # Atualizar credenciais e senhas
npm run security:check     # Verificar vulnerabilidades
```

### 🧪 **Testes e Verificação**
```bash
npm run test:connection    # Testar conexão com banco
npm run test:api           # Testar endpoints da API
.\status.bat              # Verificar status completo
```

---

## �️ Segurança Avançada

### 🔐 **Recursos Implementados**
- ✅ **Senhas criptografadas** com bcrypt (salt 12 rounds)
- ✅ **JWT Tokens** com chaves rotacionáveis
- ✅ **Sessions seguras** com secrets únicos  
- ✅ **Credenciais auto-geradas** com alta entropia
- ✅ **Logs de auditoria** completos
- ✅ **Arquivos sensíveis** protegidos (.gitignore)

### 🔄 **Rotação de Credenciais**
```bash
# Gerar novas credenciais seguras
npm run security:update

# Verificar integridade da segurança  
.\scripts\verificar-seguranca.bat
```

### ⚠️ **Arquivos Protegidos**
```
🔒 backend/.env                  # Variáveis de ambiente
🔒 backend/.credentials.json     # Credenciais geradas
🔒 backend/.keys/               # Chaves de criptografia
🔒 *.log                        # Logs do sistema
```

---

## 🗄️ Configuração do Banco de Dados

### 🐘 **PostgreSQL via Neon (Recomendado)**

1. **Criar conta**: https://neon.tech (gratuita)
2. **Criar database**: `barbeariadoalem_db`
3. **Copiar connection string**
4. **Configurar automaticamente**:
```bash
npm run setup  # Configura tudo automaticamente
```

### � **Configuração Manual (.env)**
```env
# Arquivo: backend/.env
DATABASE_URL=postgresql://user:password@host:port/barbeariadoalem_db
JWT_SECRET=auto-generated-secret
SESSION_SECRET=auto-generated-secret
ENCRYPTION_KEY=auto-generated-key
```

---

## 🎨 Funcionalidades do Sistema

### 👥 **Para Clientes**
- ✅ Agendamento online de serviços
- ✅ Visualização de horários disponíveis
- ✅ Cadastro simples e rápido
- ✅ Interface responsiva (mobile/desktop)

### 👨‍💼 **Para Administradores** 
- ✅ Painel de controle completo
- ✅ Gerenciamento de agendamentos
- ✅ Controle de disponibilidade
- ✅ Relatórios e estatísticas
- ✅ Sistema de logs e auditoria

### 🔧 **Para Desenvolvedores**
- ✅ API REST documentada
- ✅ Autenticação JWT
- ✅ Estrutura modular
- ✅ Testes automatizados
- ✅ Deploy facilitado

---

## 🛠️ Tecnologias Utilizadas

### 🎨 **Frontend**
- **Angular 19** - Framework principal
- **Bootstrap 5** - UI/UX responsivo  
- **CSS modular** - Estilos organizados
- **TypeScript** - Linguagem principal

### 🔧 **Backend**
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação stateless
- **bcrypt** - Criptografia de senhas

### ☁️ **Infraestrutura**
- **Neon PostgreSQL** - Database cloud
- **GitHub** - Controle de versão

---

## 🚀 Deploy e Produção

### ☁️ **Frontend (Vercel)**
```bash
npm run build
# Upload da pasta dist/ para Vercel
```

### 🖥️ **Backend (Railway/Heroku)**
```bash
# Já inclui Procfile para deploy automático
git push railway main
```

### 🔧 **Variáveis de Ambiente (Produção)**
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-connection-string
JWT_SECRET=production-jwt-secret-64-chars
SESSION_SECRET=production-session-secret-64-chars
FRONTEND_URL=https://barbearia-do-alem.vercel.app
```

---

## 📊 Scripts de Automação

### 🪟 **Windows (.bat)**
```bash
.\start.bat                     # Iniciar sistema completo
.\status.bat                    # Verificar status de tudo
.\scripts\start-frontend.bat    # Só frontend
.\scripts\start-backend.bat     # Só backend  
.\scripts\parar-sistema.bat     # Parar todos processos
```

### 🧪 **Testes e Verificação**
```bash
.\scripts\teste-sistema.bat     # Teste completo
.\scripts\verificar-seguranca.bat # Auditoria de segurança
```

---

## 📋 Requisitos do Sistema

### 💻 **Desenvolvimento**
- **Node.js** v18 ou superior
- **npm** v8 ou superior  
- **Angular CLI** v19: `npm install -g @angular/cli`
- **Git** para controle de versão

### 🗄️ **Banco de Dados**
- **PostgreSQL 13+** (local ou cloud)
- **Neon PostgreSQL** (recomendado para desenvolvimento)

### 🌐 **Navegadores Suportados**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 🔧 Solução de Problemas

### ❌ **Erro de Conexão com Banco**
```bash
# 1. Verificar credenciais
npm run test:connection

# 2. Reconfigurar banco
npm run setup:db

# 3. Status completo  
.\status.bat
```

### ❌ **Erro de Dependências**
```bash
# Limpar e reinstalar
npm run clean
npm run install:all
```

### ❌ **Erro de Porta Ocupada**
```bash
# Parar todos processos
.\scripts\parar-sistema.bat

# Iniciar novamente
npm run dev
```

### ❌ **Problemas de Segurança**
```bash
# Verificar integridade
.\scripts\verificar-seguranca.bat

# Regenerar credenciais
npm run security:update
```

---

## 👥 Contribuição

### 🔄 **Fluxo de Desenvolvimento**
1. Fork do projeto
2. Criar branch: `git checkout -b feature/nova-funcionalidade`
3. Fazer alterações e testar: `npm run dev`
4. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
5. Push: `git push origin feature/nova-funcionalidade`  
6. Abrir Pull Request

### 📏 **Padrões**
- **Commits**: Conventional Commits
- **CSS**: Arquivos separados, responsivo
- **JS/TS**: ESLint + Prettier
- **Segurança**: Nunca commitar .env ou credenciais

---

## 📚 Documentação Adicional

- [📖 **Guia de Setup**](COMO-INICIAR.md) - Setup passo a passo
- [🔒 **Segurança**](GUIA-SEGURANCA.md) - Práticas de segurança
- [🏗️ **Arquitetura**](ARQUITETURA.md) - Estrutura do projeto
- [🚀 **Deploy**](DEPLOYMENT.md) - Guia de produção
- [🎨 **CSS Organizado**](CSS-SEPARADO.md) - Estilos separados

---

## 📞 Suporte e Contato

- **Issues**: GitHub Issues para bugs e sugestões
- **Email**: dev@barbeariadoalem.com
- **Documentação**: http://localhost:3000/docs (API)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🎯 Status do Projeto

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Versão-2.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Angular](https://img.shields.io/badge/Angular-19-red)

---

<div align="center">

### 🏪 **Barbearia do Além** 
*Sistema profissional de agendamento*

**Desenvolvido com ❤️ usando Angular + Node.js + PostgreSQL**

---

**🚀 Para começar: `npm run setup && npm run dev`**

</div>