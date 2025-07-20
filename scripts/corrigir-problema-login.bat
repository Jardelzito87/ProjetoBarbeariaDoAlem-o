@echo off
echo ============================================
echo RESOLUÇÃO DO PROBLEMA "JÁ LOGADO"
echo ============================================
echo.

echo Este script vai resolver o problema onde aparece:
echo "Você já está logado como Admin do Além"
echo mas não consegue acessar o admin.
echo.

echo PASSO 1: Parando todos os processos...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Processos parados

echo.
echo PASSO 2: Iniciando backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
start "Backend-Corrigido" cmd /c "node server.js"

echo ⏳ Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo.
echo PASSO 3: Iniciando frontend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"
start "Frontend-Corrigido" cmd /c "ng serve --port 4200"

echo ⏳ Aguardando frontend compilar...
timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo CORREÇÕES IMPLEMENTADAS:
echo ============================================
echo ✅ Verificação real da sessão no servidor
echo ✅ Limpeza automática de dados inválidos
echo ✅ Botão para limpar sessão manualmente
echo ✅ AuthGuard corrigido para detectar tokens inválidos
echo ✅ Logs detalhados para debug
echo.

echo ============================================
echo INSTRUÇÕES PARA RESOLVER:
echo ============================================
echo.
echo 1️⃣ ACESSE: http://localhost:4200/login
echo.
echo 2️⃣ SE APARECER "Você já está logado como..."
echo    👉 Clique no botão vermelho "Limpar sessão e tentar novamente"
echo    👉 Ou abra F12 e execute: localStorage.clear()
echo.
echo 3️⃣ FAÇA LOGIN NOVAMENTE:
echo    📧 Email: admin@barbeariadoalem.com
echo    🔑 Senha: admin123
echo.
echo 4️⃣ DEVE FUNCIONAR NORMALMENTE AGORA
echo    👉 Login → Redirecionamento para /admin
echo    👉 Sem mais mensagens de "já logado"
echo.

echo ============================================
echo VERIFICAR NO NAVEGADOR:
echo ============================================
echo 🔍 Console (F12): Deve mostrar logs detalhados
echo 🔍 localStorage: Será limpo automaticamente se inválido
echo 🔍 Rede: Verificar se APIs respondem corretamente
echo ============================================

echo.
echo 🚀 Sistema iniciado! Siga as instruções acima.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
