@echo off
echo ========================================
echo    🛑 Parando Sistema - Barbearia do Alem
echo ========================================
echo.

echo Parando servidores Node.js (Backend)...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend parado
) else (
    echo ℹ️  Nenhum processo Node.js encontrado
)

echo.
echo Parando servidores Angular (Frontend)...
taskkill /F /IM ng.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Frontend parado
) else (
    echo ℹ️  Nenhum processo Angular encontrado
)

echo.
echo Parando qualquer processo na porta 3000 e 4200...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 echo ✅ Processo na porta 3000 finalizado
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4200"') do (
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 echo ✅ Processo na porta 4200 finalizado
)

echo.
echo ========================================
echo ✅ Sistema parado com sucesso!
echo ========================================
pause
