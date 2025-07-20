@echo off
echo Iniciando o sistema da Barbearia do Além com banco de dados Neon...

echo Configurando para usar o banco de dados real...
powershell -Command "(Get-Content -Path '%~dp0\src\app\app.config.ts') -replace 'const useMockService = true', 'const useMockService = false' | Set-Content -Path '%~dp0\src\app\app.config.ts'"

echo Verificando a conexão com o banco de dados...
cd %~dp0\backend
npm run test-connection

echo Iniciando o backend...
start cmd /k "cd %~dp0\backend && npm start"

echo Aguardando o backend iniciar...
timeout /t 5

echo Iniciando o frontend...
start cmd /k "cd %~dp0 && npm start"

echo Sistema iniciado!
echo Frontend: http://localhost:4200
echo Backend: http://localhost:3000