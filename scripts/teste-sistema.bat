@echo off
echo =======================================
echo    🧪 TESTE - Sistema de Login
echo =======================================
echo.

echo [1] Testando backend - Ping...
curl -s http://localhost:3000 >nul
if %errorlevel%==0 (
    echo ✅ Backend respondendo
) else (
    echo ❌ Backend offline
    exit /b 1
)

echo.
echo [2] Testando login via API...
powershell -Command "$response = try { Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"admin@barbeariadoalem.com\",\"senha\":\"admin123\"}' } catch { $null }; if($response.success) { Write-Host '✅ Login funcionando - Token:' $response.token.Substring(0,20)+'...' } else { Write-Host '❌ Login falhou' }"

echo.
echo [3] Testando frontend...
curl -s http://localhost:4200 >nul
if %errorlevel%==0 (
    echo ✅ Frontend respondendo
) else (
    echo ❌ Frontend offline
)

echo.
echo [4] Testando acesso aos agendamentos...
powershell -Command "$login = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"admin@barbeariadoalem.com\",\"senha\":\"admin123\"}'; $headers = @{Authorization = \"Bearer $($login.token)\"}; $agendamentos = Invoke-RestMethod -Uri 'http://localhost:3000/api/agendamentos' -Headers $headers; Write-Host '✅ Agendamentos carregados:' $agendamentos.Count 'registros'"

echo.
echo =======================================
echo ✅ Teste concluído!
echo.
echo 🌐 Acesse: http://localhost:4200/login
echo 🔑 Use: admin@barbeariadoalem.com / admin123
echo =======================================
pause
