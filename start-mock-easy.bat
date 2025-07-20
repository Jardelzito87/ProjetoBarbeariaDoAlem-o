@echo off
echo ===============================================
echo    INICIANDO BARBEARIA DO ALEM - MODO MOCK
echo ===============================================
echo.
echo Este modo usa dados simulados (sem PostgreSQL)
echo.
echo Verificando se Angular CLI esta instalado...
where ng >nul 2>&1
if %errorlevel% neq 0 (
    echo Angular CLI nao encontrado. Instalando...
    npm install -g @angular/cli
)

echo.
echo Instalando dependencias...
call npm install

echo.
echo Iniciando o servidor de desenvolvimento...
echo O navegador abrira automaticamente em: http://localhost:4200
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.
start http://localhost:4200
ng serve --open

pause
