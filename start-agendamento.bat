@echo off
echo Iniciando o sistema da Barbearia do Além com serviços fixos...

echo Configurando para usar o serviço mock...
powershell -Command "(Get-Content -Path '%~dp0\src\app\app.config.ts') -replace 'const useMockService = false', 'const useMockService = true' | Set-Content -Path '%~dp0\src\app\app.config.ts'"

echo Iniciando o frontend...
cd %~dp0
npm start

echo Acesse http://localhost:4200/agendamento para fazer um agendamento