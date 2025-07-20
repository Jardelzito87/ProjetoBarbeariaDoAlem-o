@echo off
echo ========================================
echo    🎭 BARBEARIA DO ALEM - Sistema Login
echo ========================================
echo.

echo [1/4] 📦 Verificando dependencias do backend...
cd backend
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    call npm install
)
cd..

echo.
echo [2/4] 📦 Verificando dependencias do frontend...
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    call npm install
)

echo.
echo [3/4] 🔑 Verificando configuracao de login...
cd backend
node setup-login.js
cd..

echo.
echo [4/4] 🚀 Iniciando servidores...
echo.
echo Iniciando backend na porta 3000...
start /B cmd /c "cd backend && node server.js"

echo Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo Iniciando frontend na porta 4200...
start /B cmd /c "ng serve"

echo.
echo ========================================
echo ✅ Sistema iniciado com sucesso!
echo.
echo 🌐 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000
echo 🔒 Login:    http://localhost:4200/login
echo 👥 Admin:    http://localhost:4200/admin
echo.
echo Credenciais padrão:
echo Email: admin@barbeariadoalem.com
echo Senha: admin123
echo.
echo ⚠️  Altere essas credenciais em produção!
echo ========================================
echo.
echo Pressione Ctrl+C para parar os servidores
pause
