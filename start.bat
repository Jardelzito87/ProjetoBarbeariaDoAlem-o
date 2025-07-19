@echo off
echo Iniciando o sistema da Barbearia do Alem...

echo Iniciando o backend...
start cmd /k "cd backend && npm start"

echo Aguardando o backend iniciar...
timeout /t 5

echo Iniciando o frontend...
start cmd /k "npm start"

echo Sistema iniciado!
echo Frontend: http://localhost:4200
echo Backend: http://localhost:3000