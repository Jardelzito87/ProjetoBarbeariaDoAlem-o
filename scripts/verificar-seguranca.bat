@echo off
echo ========================================
echo   VERIFICACAO DE SEGURANCA - BARBEARIA
echo ========================================
echo.

echo [1/7] Verificando arquivo .env...
if exist "backend\.env" (
    echo ✅ Arquivo .env: EXISTE
    findstr /c:"admin123" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        echo ❌ ALERTA: Senha padrao encontrada no .env!
    ) else (
        echo ✅ Nenhuma senha padrao encontrada
    )
) else (
    echo ❌ Arquivo .env: NAO EXISTE
)
echo.

echo [2/7] Verificando arquivo .gitignore...
findstr /c:"backend/.env" .gitignore >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ .env esta protegido pelo .gitignore
) else (
    echo ❌ .env NAO esta protegido pelo .gitignore
)
echo.

echo [3/7] Procurando senhas expostas na documentacao...
findstr /c:"admin123" *.md >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ ALERTA: Senhas encontradas em arquivos MD!
    findstr /n /c:"admin123" *.md
) else (
    echo ✅ Nenhuma senha exposta em arquivos MD
)
echo.

echo [4/7] Verificando scripts de teste...
findstr /c:"admin123" *.bat >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  AVISO: Senhas encontradas em scripts BAT
    echo    (Isso e normal para scripts de teste)
) else (
    echo ✅ Scripts limpos
)
echo.

echo [5/7] Verificando arquivos de credenciais temporarios...
if exist "backend\.credentials.json" (
    echo ⚠️  AVISO: Arquivo .credentials.json ainda existe
    echo    Recomenda-se deletar apos anotar as credenciais
) else (
    echo ✅ Nenhum arquivo de credenciais temporario
)
echo.

echo [6/7] Testando forca das chaves de seguranca...
if exist "backend\.env" (
    cd backend
    node -e "require('dotenv').config(); const jwt=process.env.JWT_SECRET; console.log(jwt && jwt.length >= 32 ? '✅ JWT Secret: FORTE (' + jwt.length + ' chars)' : '❌ JWT Secret: FRACO'); const sess=process.env.SESSION_SECRET; console.log(sess && sess.length >= 32 ? '✅ Session Secret: FORTE (' + sess.length + ' chars)' : '❌ Session Secret: FRACO');"
    cd ..
) else (
    echo ⚠️  Nao e possivel verificar - .env nao existe
)
echo.

echo [7/7] Verificando status Git...
git status --porcelain backend/.env 2>nul
if %errorlevel% equ 0 (
    echo ❌ PERIGO: backend/.env aparece no Git!
    echo    Execute: git rm --cached backend/.env
) else (
    echo ✅ backend/.env nao esta sendo trackeado pelo Git
)
echo.

echo ========================================
echo       VERIFICACAO CONCLUIDA
echo ========================================
echo.
echo 📋 RESUMO DE SEGURANCA:
echo.
echo 🔐 RECOMENDACOES:
echo    • Mantenha .env sempre fora do Git
echo    • Delete .credentials.json apos usar
echo    • Altere senhas regularmente
echo    • Monitor logs de login suspeitos
echo    • Use HTTPS em producao
echo.
echo 🚨 SE HOUVER ALERTAS:
echo    Execute: aplicar-seguranca.bat
echo.
pause
