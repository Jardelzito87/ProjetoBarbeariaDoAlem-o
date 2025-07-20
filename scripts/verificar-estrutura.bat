@echo off
echo ========================================
echo   VERIFICACAO DE ESTRUTURA - ORGANIZADA
echo ========================================
echo.

echo [1/6] Verificando estrutura de pastas...
if exist "frontend\" (
    echo ✅ Pasta frontend: EXISTE
) else (
    echo ❌ Pasta frontend: NAO EXISTE
)

if exist "backend\" (
    echo ✅ Pasta backend: EXISTE
) else (
    echo ❌ Pasta backend: NAO EXISTE
)

if exist "scripts\" (
    echo ✅ Pasta scripts: EXISTE
) else (
    echo ❌ Pasta scripts: NAO EXISTE
)
echo.

echo [2/6] Verificando arquivos do frontend...
if exist "frontend\package.json" (
    echo ✅ Frontend package.json: OK
) else (
    echo ❌ Frontend package.json: AUSENTE
)

if exist "frontend\src\" (
    echo ✅ Frontend src/: OK
) else (
    echo ❌ Frontend src/: AUSENTE
)

if exist "frontend\angular.json" (
    echo ✅ Frontend angular.json: OK
) else (
    echo ❌ Frontend angular.json: AUSENTE
)
echo.

echo [3/6] Verificando arquivos do backend...
if exist "backend\package.json" (
    echo ✅ Backend package.json: OK
) else (
    echo ❌ Backend package.json: AUSENTE
)

if exist "backend\server.js" (
    echo ✅ Backend server.js: OK
) else (
    echo ❌ Backend server.js: AUSENTE
)

if exist "backend\.env" (
    echo ✅ Backend .env: OK
) else (
    echo ❌ Backend .env: AUSENTE
)
echo.

echo [4/6] Verificando package.json principal...
if exist "package.json" (
    echo ✅ Package.json raiz: OK
    findstr /c:"workspaces" package.json >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Workspaces configurados: OK
    ) else (
        echo ⚠️  Workspaces: NAO CONFIGURADOS
    )
) else (
    echo ❌ Package.json raiz: AUSENTE
)
echo.

echo [5/6] Verificando scripts organizados...
if exist "scripts\" (
    dir /b scripts\*.bat | wc -l > temp_count.txt 2>nul
    set /p script_count=<temp_count.txt
    del temp_count.txt 2>nul
    echo ✅ Scripts encontrados na pasta scripts/
) else (
    echo ❌ Pasta scripts nao existe
)

if exist "start.bat" (
    echo ✅ Script principal start.bat: OK
) else (
    echo ❌ Script principal start.bat: AUSENTE
)
echo.

echo [6/6] Verificando estrutura limpa...
if exist "src\" (
    echo ⚠️  ALERTA: Pasta src/ na raiz (deveria estar em frontend/)
) else (
    echo ✅ Raiz limpa: src/ movido para frontend/
)

if exist "node_modules\" (
    echo ⚠️  ALERTA: node_modules na raiz (deveria estar em frontend/)
) else (
    echo ✅ Raiz limpa: node_modules movido
)
echo.

echo ========================================
echo       VERIFICACAO CONCLUIDA
echo ========================================
echo.
echo 📋 ESTRUTURA ORGANIZADA:
echo    frontend/  - Código Angular
echo    backend/   - Código Node.js  
echo    scripts/   - Scripts .bat
echo    package.json - Gerenciador principal
echo.
echo 🚀 COMANDOS DISPONIVEIS:
echo    npm run setup - Setup completo
echo    npm run dev   - Iniciar tudo
echo    start.bat     - Iniciar via script
echo.
pause
