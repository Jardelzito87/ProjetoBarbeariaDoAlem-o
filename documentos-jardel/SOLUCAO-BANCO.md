# SOLUCIONANDO ERRO DE CONEXÃO COM BANCO DE DADOS

## Problema
Erro `ECONNREFUSED` ao tentar conectar com PostgreSQL na porta 5432.

## Causa
O PostgreSQL não está instalado/rodando localmente ou as credenciais do Neon não estão configuradas.

## SOLUÇÃO RÁPIDA - MODO MOCK (Recomendado para testes)

1. **Execute o arquivo**: `start-mock-easy.bat`
   - Este arquivo já configura tudo automaticamente

2. **OU siga os passos manuais**:
   - Verifique se `src/app/app.config.ts` tem: `useMockService = true`
   - Execute apenas: `start-frontend.bat`

## SOLUÇÃO COMPLETA - BANCO REAL

### Opção A: Usar Neon PostgreSQL (Cloud - Grátis)

1. **Criar conta no Neon**: https://neon.tech
2. **Criar um banco de dados** chamado `barbeariadoalem_db`
3. **Copiar a connection string** do Neon
4. **Editar o arquivo** `backend/.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@host.neon.tech/barbeariadoalem_db?sslmode=require
   ```
5. **Configurar frontend** em `src/app/app.config.ts`:
   ```typescript
   const useMockService = false;
   ```
6. **Executar**: `start-app.bat`

### Opção B: Instalar PostgreSQL Localmente

1. **Baixar PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Instalar** com as configurações padrão (porta 5432)
3. **Criar um banco** chamado `barbearia_test`
4. **Editar o arquivo** `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:senha@localhost:5432/barbearia_test
   ```
5. **Executar**: `start-app.bat`

## Verificações

- ✅ Arquivo `backend/.env` existe e tem DATABASE_URL
- ✅ Para modo mock: `useMockService = true` no app.config.ts  
- ✅ Para banco real: `useMockService = false` no app.config.ts
- ✅ Dependências instaladas: `npm install` no root e no backend

## Contatos para Suporte

- Consulte: `COMO-INICIAR.md`
- Ou use: `start-mock-easy.bat` para início rápido
