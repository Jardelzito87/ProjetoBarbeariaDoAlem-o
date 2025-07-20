@echo off
echo ===============================================
echo    TESTANDO CONEXÃO ADMIN - BARBEARIA DO ALEM
echo ===============================================
echo.

echo Testando conexão com o backend...
echo.

echo 1. Testando API de Servicos:
curl -s http://localhost:3000/api/servicos | jq .
echo.

echo 2. Testando API de Agendamentos:
curl -s http://localhost:3000/api/agendamentos | jq .
echo.

echo 3. Testando API de Clientes:
curl -s http://localhost:3000/api/clientes | jq .
echo.

echo 4. Testando API de Datas Bloqueadas:
curl -s http://localhost:3000/api/datas-bloqueadas | jq .
echo.

echo 5. Testando API de Logs:
curl -s http://localhost:3000/api/logs-agendamentos | jq .
echo.

echo ===============================================
echo    TESTE CONCLUIDO
echo ===============================================
echo.
echo Se todas as APIs retornaram dados JSON, o admin deve funcionar!
echo Acesse: http://localhost:4200/admin
echo.
pause
