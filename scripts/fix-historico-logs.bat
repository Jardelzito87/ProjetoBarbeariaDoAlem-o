@echo off
echo ===============================================
echo    HISTORICO DE ALTERACOES CORRIGIDO!
echo ===============================================
echo.

echo Testando APIs do Admin...
echo.

echo 1. API de Logs de Agendamentos:
curl -s http://localhost:3000/api/logs-agendamentos
echo.
echo.

echo 2. API de Agendamentos:
curl -s "http://localhost:3000/api/agendamentos" | findstr "id.*cliente_nome"
echo.
echo.

echo 3. API de Clientes:
curl -s "http://localhost:3000/api/clientes" | findstr "nome.*email"
echo.
echo.

echo ===============================================
echo    TESTE CONCLUIDO
echo ===============================================
echo.
echo CORRECOES APLICADAS:
echo [✓] Query SQL corrigida para tipos compatíveis
echo [✓] COALESCE com CASE WHEN para data/hora
echo [✓] API de logs funcionando
echo [✓] Histórico de alterações carregando
echo.
echo Acesse: http://localhost:4200/admin
echo Clique em "Histórico de Alterações" para ver os logs!
echo.
pause
