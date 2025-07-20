@echo off
echo ============================================
echo DIAGNÓSTICO COMPLETO - BOTÃO FEITO
echo ============================================

echo Parando todos os processos...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Iniciando backend...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o\backend"
start "Backend-Debug" cmd /k "node server.js"

timeout /t 5 /nobreak >nul

echo.
echo Testando conectividade do backend...

echo.
echo 1. Testando se servidor responde:
curl -s http://localhost:3000/api/servicos-teste 2>nul || echo "ERRO: Backend não responde"

echo.
echo 2. Testando login:
powershell -Command "$body = @{ email = 'admin@barbeariadoalem.com'; senha = 'admin123' } | ConvertTo-Json; try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/login' -Method POST -Body $body -ContentType 'application/json'; $token = ($response.Content | ConvertFrom-Json).token; Write-Host 'TOKEN OBTIDO:' $token.Substring(0, 50)...; $headers = @{'Authorization' = 'Bearer ' + $token}; Write-Host 'Testando rota de agendamentos...'; $agendamentos = Invoke-WebRequest -Uri 'http://localhost:3000/api/agendamentos' -Method GET -Headers $headers; Write-Host 'AGENDAMENTOS:' $agendamentos.StatusCode; Write-Host 'Testando atualização de status...'; $updateBody = @{ status = 'concluído' } | ConvertTo-Json; $update = Invoke-WebRequest -Uri 'http://localhost:3000/api/agendamentos/1' -Method PATCH -Body $updateBody -ContentType 'application/json' -Headers $headers; Write-Host 'UPDATE STATUS:' $update.StatusCode; } catch { Write-Host 'ERRO:' $_.Exception.Message }"

echo.
echo ============================================
echo Iniciando frontend para teste manual...
cd /d "C:\Users\Windowns 11\Desktop\ProjetoBarbeariaDoAlem-o"
start "Frontend-Debug" cmd /k "ng serve --port 4200"

timeout /t 15 /nobreak >nul

echo.
echo ============================================
echo INSTRUÇÕES DE TESTE:
echo ============================================
echo.
echo 1. Acesse: http://localhost:4200/login
echo 2. Faça login com as credenciais padrão
echo 3. Abra F12 e vá para Console
echo 4. Teste o botão "Feito" e observe os erros
echo.
echo Os terminais do backend e frontend ficarão abertos
echo para você ver os logs em tempo real.
echo.
echo ============================================
echo VERIFICAÇÕES AUTOMÁTICAS FEITAS ACIMA:
echo ============================================
echo - Conectividade do backend
echo - Login via API
echo - Obtenção de token
echo - Acesso a agendamentos
echo - Teste de atualização de status
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
