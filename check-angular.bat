@echo off
echo Verificando a configuração do Angular...

echo.
echo === Verificando versão do Node.js ===
node --version

echo.
echo === Verificando versão do npm ===
npm --version

echo.
echo === Verificando versão do Angular CLI ===
npx ng version

echo.
echo === Verificando dependências instaladas ===
npm list --depth=0

echo.
echo === Verificando configuração do proxy ===
type proxy.conf.json

echo.
echo === Verificando configuração do Angular ===
type angular.json | findstr "serve"

echo.
echo === Verificando scripts do package.json ===
type package.json | findstr "scripts"

echo.
echo === Verificando se o servidor backend está rodando ===
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
  echo Backend está rodando em http://localhost:3000
) else (
  echo Backend não está rodando
)

echo.
echo Verificação concluída. Para iniciar o sistema completo, execute:
echo npm run dev