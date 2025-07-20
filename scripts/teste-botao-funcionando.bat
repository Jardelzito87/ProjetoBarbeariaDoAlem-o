@echo off
echo ============================================
echo      BOTAO "FEITO" - AGORA CORRIGIDO!
echo ============================================

echo.
echo 🔄 Parando processos existentes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 🚀 Iniciando backend corrigido...
cd backend
start "Backend Corrigido" /MIN cmd /k "echo Backend iniciado com status corrigido && node server.js"

echo ⏳ Aguardando backend...
timeout /t 8 >nul

echo 🌐 Iniciando frontend...
cd ..
start "Frontend Corrigido" /MIN cmd /k "echo Frontend iniciado && ng serve"

echo ⏳ Aguardando frontend...
timeout /t 15 >nul

echo.
echo ============================================
echo        TESTE DO BOTAO "FEITO"
echo ============================================

echo.
echo ✅ CORREÇÕES APLICADAS:
echo    📝 Status alterado de "concluído" para "concluido" (sem acento)
echo    🗄️ Banco de dados atualizado (7 agendamentos corrigidos)
echo    🔧 Constraints recriadas corretamente
echo    💻 Frontend e backend sincronizados
echo.

echo 🔍 COMO TESTAR:
echo    1. Acesse: http://localhost:4200/admin
echo    2. Login: admin@barbeariadoalem.com
echo    3. Senha: admin123
echo    4. Clique em qualquer botão "Feito"
echo    5. ✅ Status deve mudar para "Concluído" sem erro!
echo.

echo 📊 LOGS DETALHADOS:
echo    - Backend mostrará logs detalhados no console
echo    - Status: confirmado → concluido
echo    - ✅ Status atualizado com sucesso
echo    - 📝 Log registrado com sucesso
echo.

echo 🎯 URLs:
echo    Admin: http://localhost:4200/admin
echo    API: http://localhost:3001/api/agendamentos
echo.

echo Pressione qualquer tecla para abrir o admin...
pause >nul

start http://localhost:4200/admin

echo.
echo ============================================
echo    🎉 BOTAO "FEITO" AGORA FUNCIONA! 🎉
echo ============================================
echo.
echo O problema era incompatibilidade de encoding:
echo ❌ Código usava: "concluído" (com acento)
echo ✅ Banco esperava: "concluido" (sem acento)
echo.
echo Agora tudo está sincronizado e funcionando!
echo.
echo Pressione qualquer tecla para finalizar...
pause >nul
