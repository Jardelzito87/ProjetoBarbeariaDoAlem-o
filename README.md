# Barbearia do Além

Sistema de agendamentos para a Barbearia do Além, desenvolvido com Angular e Node.js.

## Requisitos

- Node.js (v14 ou superior)
- Angular CLI (v19.2.6)
- PostgreSQL (via Neon)

## Estrutura do Projeto

- `src/` - Código fonte do frontend Angular
- `backend/` - Código fonte do backend Node.js

## Configuração do Banco de Dados

O projeto utiliza PostgreSQL hospedado no Neon.

1. Configure as variáveis de ambiente no arquivo `backend/.env`
2. Execute o script de configuração do banco de dados:

```bash
cd backend
npm run setup-db
cd ..
```

## Instalação

1. Instale as dependências do frontend:

```bash
npm install
```

2. Instale as dependências do backend:

```bash
cd backend
npm install
cd ..
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