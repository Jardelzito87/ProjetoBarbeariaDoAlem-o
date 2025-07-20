@echo off
echo ========================================
echo   BARBEARIA DO ALEM - INICIO COMPLETO
echo ========================================
echo.

echo [1/3] Iniciando Backend...
cd backend
start "Backend - Barbearia do Alem" cmd /k "echo Backend iniciando... && node server.js"
cd ..
echo ✅ Backend iniciado na porta 3000
echo.

echo [2/3] Aguardando backend estabilizar...
timeout /t 3 /nobreak > nul
echo.

echo [3/3] Iniciando Frontend...
cd frontend
start "Frontend - Barbearia do Alem" cmd /k "echo Frontend iniciando... && ng serve"
cd ..
echo ✅ Frontend iniciado na porta 4200
echo.

echo ========================================
echo         SISTEMA INICIADO! 🎉
echo ========================================
echo.
echo 🌐 URLs do Sistema:
echo    Site: http://localhost:4200
echo    Login: http://localhost:4200/login
echo    Admin: http://localhost:4200/admin
echo    API: http://localhost:3000
echo.
echo 🔑 Credenciais (se padrão):
echo    Email: admin@barbeariadoalem.com
echo    Senha: Ver arquivo backend/.credentials.json
echo.
echo 📋 Comandos úteis:
echo    npm run dev - Iniciar tudo via npm
echo    scripts/parar-sistema.bat - Parar tudo
echo    scripts/verificar-seguranca.bat - Verificar segurança
echo.
pause
