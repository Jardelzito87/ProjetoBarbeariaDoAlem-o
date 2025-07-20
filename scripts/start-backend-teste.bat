@echo off
echo ============================================
echo INICIANDO TESTE DE DESLOGAMENTO AUTOMÁTICO
echo ============================================

echo Parando processos anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo Iniciando servidor backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
node server.js

pause
