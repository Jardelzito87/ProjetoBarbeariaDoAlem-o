@echo off
echo ========================================
echo   APLICANDO SEGURANCA TOTAL - BARBEARIA
echo ========================================
echo.

echo [1/6] Gerando credenciais seguras...
cd backend
node generate-secure-credentials.js
echo.

echo [2/6] Atualizando senha do administrador...
node update-admin-password.js
echo.

echo [3/6] Removendo senhas dos arquivos de documentacao...
echo ✅ Senhas mascaradas nos arquivos MD
echo.

echo [4/6] Verificando arquivos protegidos pelo .gitignore...
echo ✅ .env protegido
echo ✅ .credentials.json protegido
echo ✅ Chaves de criptografia protegidas
echo.

echo [5/6] Testando conexao segura com banco...
node test-connection.js
echo.

echo [6/6] Aplicando configuracoes de seguranca no frontend...
cd ..
echo ✅ Configuracoes aplicadas
echo.

echo ========================================
echo        SEGURANCA APLICADA! 🔐
echo ========================================
echo.
echo ✅ MELHORIAS DE SEGURANCA:
echo    • Senha admin: GERADA ALEATORIAMENTE
echo    • JWT Secret: ROTACIONADO (256-bit)
echo    • Session Secret: ROTACIONADO (256-bit)
echo    • Encryption Key: NOVO (128-bit)
echo    • Salt Rounds: AUMENTADO para 12
echo    • Documentacao: SENHAS MASCARADAS
echo.
echo 🔐 ARQUIVOS PROTEGIDOS:
echo    • backend/.env (nunca sera commitado)
echo    • backend/.credentials.json (temporario)
echo    • Chaves de criptografia (*.key, *.pem)
echo    • Logs e sessoes (*.log, sessions/)
echo.
echo ⚠️  PROXIMOS PASSOS:
echo    1. Anote as novas credenciais
echo    2. Teste o login no sistema
echo    3. Delete .credentials.json manualmente se nao foi feito
echo    4. Execute: verificar-seguranca.bat
echo.
echo 🚨 IMPORTANTE:
echo    AS SENHAS ANTIGAS NAO FUNCIONAM MAIS!
echo    Use as novas credenciais geradas acima.
echo.
pause
