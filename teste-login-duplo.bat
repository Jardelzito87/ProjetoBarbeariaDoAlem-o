@echo off
echo ============================================
echo TESTE DE PREVENÇÃO DE LOGIN DUPLO
echo ============================================
echo.

echo Parando processos Node.js antigos...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Iniciando backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
start "Backend" cmd /c "node server.js"

echo Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo.
echo Iniciando frontend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"
start "Frontend" cmd /c "ng serve --port 4200"

echo Aguardando frontend compilar...
timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo INSTRUÇÕES PARA TESTE:
echo ============================================
echo 1. Abra http://localhost:4200/login no navegador
echo 2. Faça login com: admin@barbeariadoalem.com / admin123
echo 3. Após login bem-sucedido, abra uma nova aba
echo 4. Tente fazer login novamente na nova aba
echo 5. Você deve ver a mensagem de "sessão já ativa"
echo ============================================

echo.
echo Sistema iniciado! Pressione qualquer tecla para sair...
pause >nul
