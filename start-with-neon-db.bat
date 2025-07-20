@echo off
echo ===============================================
echo    BARBEARIA DO ALEM - BANCO NEON CONECTADO
echo ===============================================
echo.
echo Este modo usa o banco de dados PostgreSQL Neon
echo.

echo Verificando se Angular CLI esta instalado...
where ng >nul 2>&1
if %errorlevel% neq 0 (
    echo Angular CLI nao encontrado. Instalando...
    npm install -g @angular/cli
)

echo.
echo Parando processos anteriores na porta 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Iniciando Backend (Porta 3000)...
start "Backend" cmd /k "cd backend && npm start"

echo.
echo Aguardando backend inicializar...
timeout /t 8 >nul

echo.
echo Iniciando Frontend (Porta 4200)...
echo O navegador abrira automaticamente em: http://localhost:4200
echo.
echo URLs importantes:
echo - Frontend: http://localhost:4200
echo - Admin: http://localhost:4200/admin  
echo - Backend API: http://localhost:3000/api
echo.
echo Para parar ambos servidores, feche as janelas dos terminais
echo.
start http://localhost:4200
ng serve --open

pause
