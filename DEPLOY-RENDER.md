# 🚀 Deploy no Render - Guia Rápido

## 📋 Passo a Passo

### 1. Backend (Web Service)
```
Nome: barbearia-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**Variáveis de Ambiente:**
```
NODE_ENV=production
DATABASE_URL=sua_connection_string_neon
JWT_SECRET=sua_chave_64_chars
SESSION_SECRET=sua_chave_64_chars
ENCRYPTION_KEY=sua_chave_32_chars
FRONTEND_URL=https://seu-frontend.onrender.com
```

### 2. Frontend (Static Site)
```
Nome: barbearia-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist/projeto-angular/browser
```

### 3. URLs Finais
- Frontend: https://barbearia-frontend.onrender.com
- Backend: https://barbearia-backend.onrender.com
- API: https://barbearia-backend.onrender.com/api

## ✅ Pronto para Deploy!