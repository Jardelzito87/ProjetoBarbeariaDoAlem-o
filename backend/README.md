# Backend da Barbearia do Além

Este é o backend para o sistema de agendamentos da Barbearia do Além.

## Requisitos

- Node.js (v14 ou superior)
- PostgreSQL (via Neon)

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

O arquivo `.env` já está configurado com a string de conexão do Neon:

```
DATABASE_URL=postgresql://neondb_owner:npg_KM2uPfyRNw5p@ep-crimson-heart-acvcbehd-pooler.sa-east-1.aws.neon.tech/barbeariadoalem_db?sslmode=require&channel_binding=require
PORT=3000
```

3. Teste a conexão com o banco de dados:

```bash
npm run test-connection
```

4. Configure o banco de dados:

```bash
npm run setup-db
```

## Executando o servidor

```bash
npm start
```

Para desenvolvimento com reinicialização automática:

```bash
npm run dev
```

## Solução de problemas

Se você encontrar erros ao configurar o banco de dados:

1. Verifique se a string de conexão está correta no arquivo `.env`
2. Execute o script de teste de conexão para verificar se o banco de dados está acessível:
   ```bash
   npm run test-connection
   ```
3. Se o erro persistir, verifique os logs para mais detalhes

## API Endpoints

### Serviços

- `GET /api/servicos` - Listar todos os serviços

### Clientes

- `POST /api/clientes` - Criar um novo cliente

### Agendamentos

- `GET /api/agendamentos` - Listar todos os agendamentos
- `POST /api/agendamentos` - Criar um novo agendamento
- `PATCH /api/agendamentos/:id` - Atualizar status de um agendamento

### Datas Bloqueadas

- `POST /api/datas-bloqueadas` - Bloquear uma data
- `DELETE /api/datas-bloqueadas/:data` - Desbloquear uma data