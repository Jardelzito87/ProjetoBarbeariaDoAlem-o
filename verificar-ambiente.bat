@echo off
echo ========================================
echo   VERIFICACAO DE AMBIENTE - BARBEARIA
echo ========================================
echo.

echo [1/7] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('node --version') do echo ✅ Node.js: %%a
) else (
    echo ❌ Node.js NAO ENCONTRADO
    echo    Instale em: https://nodejs.org/
)
echo.

echo [2/7] Verificando Angular CLI...
ng version --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Angular CLI: Instalado
) else (
    echo ❌ Angular CLI NAO ENCONTRADO
    echo    Execute: npm install -g @angular/cli
)
echo.

echo [3/7] Verificando arquivo .env...
if exist "backend\.env" (
    echo ✅ Arquivo backend\.env: EXISTE
) else (
    echo ⚠️  Arquivo backend\.env: NAO EXISTE
    echo    Execute: setup-projeto.bat
)
echo.

echo [4/7] Verificando dependencias do frontend...
if exist "node_modules" (
    echo ✅ Dependencias frontend: INSTALADAS
) else (
    echo ⚠️  Dependencias frontend: NAO INSTALADAS
    echo    Execute: npm install
)
echo.

echo [5/7] Verificando dependencias do backend...
if exist "backend\node_modules" (
    echo ✅ Dependencias backend: INSTALADAS
) else (
    echo ⚠️  Dependencias backend: NAO INSTALADAS
    echo    Execute: cd backend && npm install
)
echo.

echo [6/7] Testando conexao com banco...
if exist "backend\.env" (
    cd backend
    node test-connection.js >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Conexao com banco: OK
    ) else (
        echo ❌ Conexao com banco: FALHOU
        echo    Verifique credenciais em backend\.env
    )
    cd ..
) else (
    echo ⚠️  Nao é possivel testar - arquivo .env nao existe
)
echo.

echo [7/7] Verificando portas em uso...
netstat -an | find ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000: EM USO
) else (
    echo ✅ Porta 3000: LIVRE
)

netstat -an | find ":4200" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 4200: EM USO
) else (
    echo ✅ Porta 4200: LIVRE
)
echo.

echo ========================================
echo          VERIFICACAO CONCLUIDA
echo ========================================
echo.
echo 📋 PROXIMOS PASSOS:
echo.
echo Se tudo estiver ✅ OK:
echo    Execute: start-completo.bat
echo.
echo Se houver ❌ ou ⚠️  problemas:
echo    Execute: setup-projeto.bat
echo.
pause
