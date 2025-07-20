@echo off
echo ============================================
echo TESTE DE DESLOGAMENTO AUTOMÁTICO
echo ============================================
echo.
echo Este script testa se todos os administradores
echo são deslogados automaticamente quando o servidor
echo é reiniciado.
echo.

echo PASSO 1: Parando todos os processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Processos parados

echo.
echo PASSO 2: Iniciando backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
start "Backend-Teste" cmd /c "node server.js"

echo ⏳ Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

echo.
echo PASSO 3: Iniciando frontend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"
start "Frontend-Teste" cmd /c "ng serve --port 4200"

echo ⏳ Aguardando frontend compilar...
timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo INSTRUÇÕES DE TESTE:
echo ============================================
echo.
echo 1️⃣ PRIMEIRO LOGIN:
echo    • Abra: http://localhost:4200/login
echo    • Login: admin@barbeariadoalem.com
echo    • Senha: admin123
echo    • Acesse o painel admin: http://localhost:4200/admin
echo.
echo 2️⃣ SIMULAR REINÍCIO DO SERVIDOR:
echo    • Pressione Ctrl+C no terminal do backend
echo    • Ou execute: taskkill /F /IM node.exe
echo    • Reinicie apenas o backend: node server.js
echo.
echo 3️⃣ TESTAR DESLOGAMENTO AUTOMÁTICO:
echo    • Recarregue a página admin (F5)
echo    • Ou tente acessar qualquer rota protegida
echo    • Você deve ser redirecionado para o login
echo    • O localStorage deve ser limpo automaticamente
echo.
echo 4️⃣ VERIFICAR LOGS:
echo    • No console do backend: "X sessão(ões) ativa(s) foram invalidadas"
echo    • No console do navegador: "Token inválido detectado - servidor pode ter sido reiniciado"
echo.
echo ============================================
echo COMPORTAMENTOS ESPERADOS:
echo ============================================
echo ✅ Backend limpa todas as sessões ao iniciar
echo ✅ Frontend detecta token inválido
echo ✅ Logout automático é executado
echo ✅ Redirecionamento para página de login
echo ✅ Usuário precisa fazer login novamente
echo ============================================

echo.
echo 🎯 Sistema iniciado! Siga as instruções acima para testar.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
