# 🚀 Deploy - Barbearia do Além

## 📋 Pré-requisitos

1. **Conta no Render**: https://render.com
2. **Banco PostgreSQL**: Neon.tech (gratuito)
3. **Repositório GitHub**: Código commitado

## 🗄️ 1. Configurar Banco de Dados

### Neon PostgreSQL
```bash
# 1. Criar conta em https://neon.tech
# 2. Criar database: barbeariadoalem_db
# 3. Copiar connection string
```

## 🔧 2. Deploy Backend (Render)

### Criar Web Service
1. **New** → **Web Service**
2. **Connect Repository** → Selecionar seu repo
3. **Configurações**:
   - **Name**: `barbearia-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Variáveis de Ambiente
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host/barbeariadoalem_db
JWT_SECRET=sua_chave_jwt_64_caracteres
SESSION_SECRET=sua_chave_session_64_caracteres
ENCRYPTION_KEY=sua_chave_encryption_32_caracteres
FRONTEND_URL=https://seu-frontend.onrender.com
```

## 🎨 3. Deploy Frontend (Render)

### Criar Static Site
1. **New** → **Static Site**
2. **Connect Repository** → Selecionar seu repo
3. **Configurações**:
   - **Name**: `barbearia-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/projeto-angular`

### Variáveis de Ambiente
```env
NODE_ENV=production
```

## 🔗 4. Configurar URLs

### Backend (.env)
```env
FRONTEND_URL=https://barbearia-frontend.onrender.com
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://barbearia-backend.onrender.com/api'
};
```

## ✅ 5. Verificar Deploy

### URLs de Acesso
- **Frontend**: https://barbearia-frontend.onrender.com
- **Backend**: https://barbearia-backend.onrender.com
- **API Docs**: https://barbearia-backend.onrender.com/docs

### Teste Rápido
```bash
# Testar API
curl https://barbearia-backend.onrender.com/api/servicos

# Testar Frontend
curl https://barbearia-frontend.onrender.com
```

## 🔒 6. Gerar Credenciais Seguras

```bash
# Executar localmente antes do deploy
npm run security:update
```

## 📝 Comandos Úteis

```bash
# Build local
npm run build

# Testar produção local
NODE_ENV=production npm start

# Logs do Render
# Acessar via dashboard do Render
```