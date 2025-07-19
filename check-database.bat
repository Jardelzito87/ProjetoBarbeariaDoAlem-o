@echo off
echo Verificando o banco de dados da Barbearia do Além...
cd %~dp0\backend
npm run check-tables
pause