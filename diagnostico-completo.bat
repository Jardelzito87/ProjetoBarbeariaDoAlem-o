@echo off
echo =======================================
echo    🔧 DIAGNOSTICO COMPLETO - Sistema
echo =======================================
echo.

echo [1] Verificando se servidores estão rodando...
netstat -an | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo ✅ Backend: ONLINE (porta 3000)
) else (
    echo ❌ Backend: OFFLINE
)

netstat -an | findstr ":4200" | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo ✅ Frontend: ONLINE (porta 4200)
) else (
    echo ❌ Frontend: OFFLINE
)

echo.
echo [2] Testando API backend...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"admin@barbeariadoalem.com\",\"senha\":\"admin123\"}' -TimeoutSec 5; Write-Host '✅ Login API:' $response.success } catch { Write-Host '❌ Login API: FALHA' }"

echo.
echo [3] Verificando arquivos críticos...
if exist "src\app\guards\auth.guard.ts" (
    echo ✅ AuthGuard existe
) else (
    echo ❌ AuthGuard não encontrado
)

if exist "src\app\services\auth.service.ts" (
    echo ✅ AuthService existe
) else (
    echo ❌ AuthService não encontrado
)

if exist "src\app\component\login\login.component.ts" (
    echo ✅ LoginComponent existe
) else (
    echo ❌ LoginComponent não encontrado
)

echo.
echo [4] Verificando configuração...
findstr /C:"apiUrl" "src\environments\environment.ts" >nul
if %errorlevel%==0 (
    echo ✅ Environment configurado
) else (
    echo ❌ Environment não configurado
)

findstr /C:"admin-token" "src\app\services\database.service.ts" >nul
if %errorlevel%==0 (
    echo ✅ DatabaseService com autenticação
) else (
    echo ❌ DatabaseService sem autenticação
)

echo.
echo [5] Testando URLs diretas...
echo 📍 Testando http://localhost:4200/login
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:4200/login' -TimeoutSec 3 -UseBasicParsing; Write-Host '✅ Login Page: ACESSÍVEL' } catch { Write-Host '❌ Login Page: INACESSÍVEL' }"

echo 📍 Testando http://localhost:4200/admin  
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:4200/admin' -TimeoutSec 3 -UseBasicParsing; Write-Host '✅ Admin Page: RESPONDE' } catch { Write-Host '❌ Admin Page: NÃO RESPONDE' }"

echo.
echo =======================================
echo 📋 RESUMO DO DIAGNÓSTICO CONCLUÍDO
echo.
echo 🌐 URLs para teste manual:
echo    Login: http://localhost:4200/login
echo    Admin: http://localhost:4200/admin
echo.
echo 🔑 Credenciais:
echo    Email: admin@barbeariadoalem.com
echo    Senha: admin123
echo =======================================
pause
