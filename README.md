# 🎭 Barbearia do Além

Sistema de agendamentos para a Barbearia do Além, desenvolvido com Angular e Node.js com autenticação JWT.

## ⚡ Setup Rápido (Após Clonar)

```bash
# Execute apenas este comando:
setup-projeto.bat

# Depois execute para iniciar:
start-completo.bat
```

**⚠️ IMPORTANTE**: Se houver erro de banco, edite `backend/.env` com suas credenciais do Neon.

## 🚀 Acesso ao Sistema

- **Site**: http://localhost:4200
- **Login Admin**: http://localhost:4200/login
- **Painel Admin**: http://localhost:4200/admin

### 🔑 Credenciais Padrão
- **Email**: `admin@barbeariadoalem.com`
- **Senha**: `admin123`

## 📋 Requisitos

- Node.js (v14 ou superior)
- Angular CLI (v19.2.6)
- Conta no Neon PostgreSQL (grátis)

## 🏗️ Estrutura do Projeto

- `src/` - Frontend Angular com sistema de login
- `backend/` - Backend Node.js + Express + JWT
- `backend/.env` - Configurações do banco (não commitado)
- `backend/.env.example` - Template de configuração

## 🛠️ Configuração Manual (se necessário)

### 1. Configurar Banco de Dados Neon

1. Crie uma conta em https://neon.tech
2. Crie um banco chamado `barbeariadoalem_db`
3. Copie a connection string
4. Cole no arquivo `backend/.env`

### 2. Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configurar Login

```bash
cd backend
node setup-login.js
```

## Executando o Projeto

### Desenvolvimento

Para executar o frontend e o backend simultaneamente:

```bash
npm run dev
```

Ou execute-os separadamente:

- Frontend: `npm start` (acessível em http://localhost:4200)
- Backend: `cd backend && npm start` (acessível em http://localhost:3000)

### Produção

Para construir o projeto para produção:

```bash
npm run build
```

## Recursos

- Agendamento de serviços
- Cadastro de clientes
- Gerenciamento de horários
- Interface temática de "além"

## Tecnologias Utilizadas

- Frontend: Angular 19, Bootstrap 5
- Backend: Node.js, Express
- Banco de Dados: PostgreSQL (Neon)

## Desenvolvimento

### Gerando Novos Componentes

```bash
ng generate component component-name
```

Para uma lista completa de comandos disponíveis:

```bash
ng generate --help
```

### Testes

Para executar testes unitários:

```bash
npm test
```

## Recursos Adicionais

Para mais informações sobre o Angular CLI, visite a [Documentação do Angular CLI](https://angular.dev/tools/cli).