@echo off
chcp 65001 > nul 2>&1
cls

echo =====================================
echo   VERIFICAÇÃO SISTEMA BARBEARIA
echo =====================================
echo.

:: Definir workspace
set "WORKSPACE=%~dp0"
cd /d "%WORKSPACE%" 2>nul

:: Função de teste simples
echo [1] Estrutura de Pastas
if exist "backend\" echo ✅ Backend | if not exist "backend\" echo ❌ Backend
if exist "frontend\" echo ✅ Frontend | if not exist "frontend\" echo ❌ Frontend  
if exist "scripts\" echo ✅ Scripts | if not exist "scripts\" echo ❌ Scripts

echo.
echo [2] Arquivos de Configuração
if exist "package.json" echo ✅ Package raiz | if not exist "package.json" echo ❌ Package raiz
if exist "backend\package.json" echo ✅ Package backend | if not exist "backend\package.json" echo ❌ Package backend
if exist "frontend\package.json" echo ✅ Package frontend | if not exist "frontend\package.json" echo ❌ Package frontend

echo.
echo [3] Segurança
if exist "backend\.env" echo ✅ Configuração .env | if not exist "backend\.env" echo ❌ Configuração .env
if exist "backend\.env.example" echo ✅ Exemplo .env | if not exist "backend\.env.example" echo ❌ Exemplo .env
if exist "backend\generate-secure-credentials.js" echo ✅ Script segurança | if not exist "backend\generate-secure-credentials.js" echo ❌ Script segurança

echo.
echo [4] Dependências
if exist "node_modules\" echo ✅ Deps raiz | if not exist "node_modules\" echo ⚠️ Execute: npm install
if exist "frontend\node_modules\" echo ✅ Deps frontend | if not exist "frontend\node_modules\" echo ⚠️ Execute: cd frontend ^&^& npm install
if exist "backend\node_modules\" echo ✅ Deps backend | if not exist "backend\node_modules\" echo ⚠️ Execute: cd backend ^&^& npm install

echo.
echo [5] Teste de Banco de Dados
cd backend
if exist "tests\test-connection.js" (
    node tests\test-connection.js >nul 2>&1
    if errorlevel 0 (echo ✅ Conexão DB) else (echo ❌ Erro DB)
) else (
    echo ⚠️ Script teste não existe
)
cd ..

echo.
echo [6] Scripts de Automação  
if exist "scripts\start-backend.bat" echo ✅ Script backend | if not exist "scripts\start-backend.bat" echo ❌ Script backend
if exist "scripts\start-frontend.bat" echo ✅ Script frontend | if not exist "scripts\start-frontend.bat" echo ❌ Script frontend
if exist "start.bat" echo ✅ Inicializador | if not exist "start.bat" echo ❌ Inicializador

echo.
echo [7] Status dos Serviços
for /f %%a in ('tasklist ^| findstr "node.exe" 2^>nul ^| find /c /v ""') do (
    if %%a GTR 0 (echo ✅ Node.js ativo - %%a processos) else (echo ⚠️ Node.js inativo)
)

echo.
echo =====================================
echo   URLS DO SISTEMA
echo =====================================
echo 🌐 Frontend:  http://localhost:4200
echo 📡 Backend:   http://localhost:3000  
echo 🔐 Login:     http://localhost:4200/login
echo 👨‍💼 Admin:     http://localhost:4200/admin

echo.
echo =====================================
echo   COMANDOS ÚTEIS
echo =====================================
echo 🚀 Iniciar:      .\start.bat
echo 🚀 Iniciar NPM:  npm run dev
echo ⚙️ Setup:        npm run setup
echo 🔒 Segurança:    npm run security:update
echo 🛑 Parar:        scripts\parar-sistema.bat

echo.
echo =====================================
echo   CREDENCIAIS DE ACESSO
echo =====================================
if exist "backend\.credentials.json" (
    echo ✅ Credenciais disponíveis
    echo 📧 Email: admin@barbeariadoalem.com  
    echo 🔑 Senha: Ver arquivo backend\.credentials.json
) else (
    echo ⚠️ Execute: npm run setup:security
)

echo.
pause
