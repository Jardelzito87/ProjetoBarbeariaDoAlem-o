@echo off
chcp 65001 > nul
echo ======================================
echo   VERIFICAÇÃO DA ESTRUTURA DO PROJETO
echo ======================================

set "WORKSPACE=%~dp0"
cd /d "%WORKSPACE%"

echo [1/8] Verificando estrutura de pastas...
if exist "backend" (
    echo ✅ /backend - Existe
) else (
    echo ❌ /backend - Não encontrada
)

if exist "frontend" (
    echo ✅ /frontend - Existe
) else (
    echo ❌ /frontend - Não encontrada
)

if exist "scripts" (
    echo ✅ /scripts - Existe
) else (
    echo ❌ /scripts - Não encontrada
)

echo.
echo [2/8] Verificando arquivos essenciais...
if exist "package.json" (
    echo ✅ package.json raiz - Existe
) else (
    echo ❌ package.json raiz - Não encontrado
)

if exist "backend\package.json" (
    echo ✅ backend/package.json - Existe
) else (
    echo ❌ backend/package.json - Não encontrado
)

if exist "frontend\package.json" (
    echo ✅ frontend/package.json - Existe
) else (
    echo ❌ frontend/package.json - Não encontrado
)

echo.
echo [3/8] Verificando configurações de segurança...
if exist "backend\.env" (
    echo ✅ backend/.env - Existe
) else (
    echo ❌ backend/.env - Não encontrado
)

if exist "backend\.env.example" (
    echo ✅ backend/.env.example - Existe
) else (
    echo ❌ backend/.env.example - Não encontrado
)

if exist "backend\generate-secure-credentials.js" (
    echo ✅ Script de credenciais - Existe
) else (
    echo ❌ Script de credenciais - Não encontrado
)

echo.
echo [4/8] Verificando dependências...
if exist "node_modules" (
    echo ✅ Dependências raiz - Instaladas
) else (
    echo ⚠️ Dependências raiz - Execute: npm install
)

if exist "frontend\node_modules" (
    echo ✅ Dependências frontend - Instaladas
) else (
    echo ⚠️ Dependências frontend - Execute: cd frontend && npm install
)

if exist "backend\node_modules" (
    echo ✅ Dependências backend - Instaladas
) else (
    echo ⚠️ Dependências backend - Execute: cd backend && npm install
)

echo.
echo [5/8] Testando conexão com banco...
cd backend
if exist "test-connection.js" (
    node test-connection.js >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Conexão com banco - OK
    ) else (
        echo ❌ Conexão com banco - ERRO
    )
) else (
    echo ⚠️ Script de teste não encontrado
)
cd ..

echo.
echo [6/8] Verificando scripts de automação...
if exist "scripts\start-backend.bat" (
    echo ✅ Scripts de backend - OK
) else (
    echo ❌ Scripts de backend - Não encontrados
)

if exist "scripts\start-frontend.bat" (
    echo ✅ Scripts de frontend - OK
) else (
    echo ❌ Scripts de frontend - Não encontrados
)

echo.
echo [7/8] Verificando portas...
netstat -an 2>nul | findstr ":3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Porta 3000 (Backend) - Ativa
) else (
    echo ⚠️ Porta 3000 (Backend) - Inativa
)

netstat -an 2>nul | findstr ":4200" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Porta 4200 (Frontend) - Ativa
) else (
    echo ⚠️ Porta 4200 (Frontend) - Inativa
)

echo.
echo [8/8] URLs de teste...
echo 🌐 Frontend: http://localhost:4200
echo 📡 API Backend: http://localhost:3000
echo 🔐 Login Admin: http://localhost:4200/login
echo 👨‍💼 Painel Admin: http://localhost:4200/admin

echo.
echo ======================================
echo   VERIFICAÇÃO COMPLETA!
echo ======================================
echo.
echo 📝 Para iniciar o sistema:
echo    • .\start.bat
echo    • npm run dev
echo.
echo 🔒 Para configurar segurança:
echo    • npm run setup:security  
echo    • scripts\verificar-seguranca.bat
echo.
pause
