@echo off
echo ============================================
echo TESTANDO TELA DE LOGIN
echo ============================================

echo Parando processos anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo Iniciando apenas o frontend Angular...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"

echo Verificando se ng está disponível...
ng version

echo.
echo Iniciando servidor de desenvolvimento...
ng serve --port 4200 --host 0.0.0.0

pause
