@echo off
echo ============================================
echo TESTE DE ATUALIZAÇÃO DE STATUS
echo ============================================

echo Este script testa especificamente o botão de
echo atualizar status dos agendamentos.
echo.

echo PASSO 1: Parando processos anteriores...
taskkill /F /IM node.exe >nul 2>&1

echo PASSO 2: Iniciando backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
start "Backend-Status" cmd /c "node server.js"

echo ⏳ Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo.
echo PASSO 3: Iniciando frontend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"
start "Frontend-Status" cmd /c "ng serve --port 4200"

echo ⏳ Aguardando frontend compilar...
timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo MELHORIAS IMPLEMENTADAS:
echo ============================================
echo ✅ Logs detalhados de debug no console
echo ✅ Verificação de token antes da requisição
echo ✅ Tratamento específico de erro 401 (não autorizado)
echo ✅ Mensagens de erro mais informativas
echo ✅ Redirecionamento automático para login se necessário
echo.

echo ============================================
echo COMO TESTAR:
echo ============================================
echo.
echo 1️⃣ FAÇA LOGIN:
echo    👉 http://localhost:4200/login
echo    📧 admin@barbeariadoalem.com
echo    🔑 admin123
echo.
echo 2️⃣ ACESSE O PAINEL ADMIN:
echo    👉 http://localhost:4200/admin
echo    👉 Deve carregar a lista de agendamentos
echo.
echo 3️⃣ TESTE O BOTÃO "FEITO":
echo    👉 Escolha um agendamento pendente ou confirmado
echo    👉 Clique no botão "✅ Feito"
echo    👉 Observe o console (F12) para logs detalhados
echo.
echo 4️⃣ VERIFIQUE O RESULTADO:
echo    ✅ Status deve mudar para "Concluído"
echo    ✅ Contadores devem ser atualizados
echo    ✅ Filtro "Feitos" deve mostrar o agendamento
echo    ✅ Mensagem de sucesso deve aparecer
echo.

echo ============================================
echo LOGS A OBSERVAR NO CONSOLE (F12):
echo ============================================
echo 🔄 "Iniciando atualização de status..."
echo 📋 Dados do agendamento e novo status
echo ✅ "Status atualizado com sucesso"
echo 📝 "Lista local atualizada"
echo.
echo SE DER ERRO:
echo ❌ Status HTTP e mensagem de erro detalhada
echo 🔐 Verificação se é problema de autenticação
echo ============================================

echo.
echo 🚀 Sistema iniciado! Teste o botão de status agora.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
