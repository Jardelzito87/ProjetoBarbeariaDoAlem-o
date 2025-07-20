# 🚀 Guia para Novos Desenvolvedores

## ⚡ Setup Rápido (Primeiro Clone)

```bash
git clone https://github.com/Jardelzito87/ProjetoBarbeariaDoAlem-o.git
cd ProjetoBarbeariaDoAlem-o
setup-projeto.bat
```

**Se tudo der certo, execute:**
```bash
start-completo.bat
```

## 🔧 Se Houver Problema de Banco

O erro mais comum é: `ECONNREFUSED ::1:5432`

**Solução:**

1. **Obtenha as credenciais do Neon:**
   - Acesse https://neon.tech
   - Faça login na conta do projeto
   - Copie a connection string

2. **Edite o arquivo `backend/.env`:**
   ```env
   DATABASE_URL=postgresql://usuario:senha@host.neon.tech/barbeariadoalem_db?sslmode=require
   ```

3. **Teste a conexão:**
   ```bash
   cd backend
   node test-connection.js
   ```

4. **Se funcionou, inicie tudo:**
   ```bash
   start-completo.bat
   ```

## 🎯 Credenciais Padrão

- **Email**: `admin@barbeariadoalem.com`
- **Senha**: `***SENHA_SEGURA***`

## 📝 URLs Importantes

- **Site**: http://localhost:4200
- **Login**: http://localhost:4200/login
- **Admin**: http://localhost:4200/admin
- **API**: http://localhost:3000

## 🔄 Fluxo de Desenvolvimento

1. **Clonar repositório**
2. **Executar `setup-projeto.bat`**
3. **Configurar banco (se necessário)**
4. **Executar `start-completo.bat`**
5. **Desenvolver! 🎉**

## 🆘 Troubleshooting

### Frontend não carrega
```bash
npm install
ng serve
```

### Backend não conecta
```bash
cd backend
npm install
node test-connection.js
```

### Login não funciona
```bash
cd backend
node setup-login.js
```

### Banco não conecta
Edite `backend/.env` com credenciais corretas do Neon

## 📞 Suporte

Se encontrar problemas, verifique:

1. ✅ Node.js instalado
2. ✅ Angular CLI instalado  
3. ✅ Arquivo `backend/.env` existe
4. ✅ Credenciais do Neon corretas
5. ✅ Internet funcionando (para Neon)

---

**💡 Dica**: Mantenha sempre o arquivo `backend/.env.example` atualizado com a estrutura correta!
