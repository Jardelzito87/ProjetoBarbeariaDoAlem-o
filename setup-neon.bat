@echo off
echo Configurando o banco de dados Neon para a Barbearia do Além...
cd %~dp0\backend
npm run setup-neon
pause