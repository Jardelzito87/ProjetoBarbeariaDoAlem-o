@echo off
echo ========================================
echo   SETUP AUTOMATICO - BARBEARIA DO ALEM
echo ========================================
echo.

echo [1/6] Copiando arquivo de configuracao...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Arquivo .env criado a partir do .env.example
) else (
    echo ⚠️  Arquivo .env já existe - pulando...
)
echo.

echo [2/6] Instalando dependencias do backend...
cd backend
call npm install
echo ✅ Dependencias do backend instaladas
cd ..
echo.

echo [3/6] Instalando dependencias do frontend...
call npm install
echo ✅ Dependencias do frontend instaladas
echo.

echo [4/6] Testando conexao com banco de dados...
cd backend
call node test-connection.js
if %errorlevel% neq 0 (
    echo ❌ ERRO: Nao foi possivel conectar ao banco!
    echo.
    echo 📝 INSTRUCOES:
    echo 1. Edite o arquivo backend\.env
    echo 2. Substitua a DATABASE_URL pela sua string do Neon
    echo 3. Execute novamente: setup-projeto.bat
    echo.
    pause
    exit /b 1
)
echo ✅ Conexao com banco estabelecida
cd ..
echo.

echo [5/6] Configurando sistema de login...
cd backend
call node setup-login.js
echo ✅ Sistema de login configurado
cd ..
echo.

echo [6/6] Criando scripts de inicializacao...
echo @echo off > start-completo.bat
echo echo Iniciando Backend... >> start-completo.bat
echo start "Backend" cmd /k "cd backend && node server.js" >> start-completo.bat
echo echo. >> start-completo.bat
echo echo Aguardando 3 segundos... >> start-completo.bat
echo timeout /t 3 /nobreak ^> nul >> start-completo.bat
echo echo. >> start-completo.bat
echo echo Iniciando Frontend... >> start-completo.bat
echo start "Frontend" cmd /k "ng serve" >> start-completo.bat
echo echo. >> start-completo.bat
echo echo ✅ Sistema iniciado! >> start-completo.bat
echo echo    Backend: http://localhost:3000 >> start-completo.bat
echo echo    Frontend: http://localhost:4200 >> start-completo.bat
echo echo    Login: http://localhost:4200/login >> start-completo.bat
echo pause >> start-completo.bat

echo ✅ Script start-completo.bat criado
echo.

echo ========================================
echo           SETUP CONCLUIDO! 🎉
echo ========================================
echo.
echo 📋 CREDENCIAIS DE LOGIN:
echo    Email: admin@barbeariadoalem.com
echo    Senha: admin123
echo.
echo 🚀 COMO INICIAR:
echo    Execute: start-completo.bat
echo.
echo 🌐 ACESSAR SISTEMA:
echo    Site: http://localhost:4200
echo    Login: http://localhost:4200/login
echo    Admin: http://localhost:4200/admin
echo.
echo ⚠️  IMPORTANTE: 
echo    Se houver erro de banco, edite backend\.env
echo    com sua string de conexao do Neon
echo.
pause
