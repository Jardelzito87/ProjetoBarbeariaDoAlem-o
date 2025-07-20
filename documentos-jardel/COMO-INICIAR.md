# Como Iniciar o Sistema da Barbearia do Além

Este documento contém instruções passo a passo para iniciar o sistema da Barbearia do Além.

## Opção 1: Iniciar com o Modo Mock (Recomendado para testes)

O modo mock usa dados simulados armazenados no navegador, sem necessidade de banco de dados.

1. Abra o arquivo `src/app/app.config.ts` e verifique se a linha está assim:
   ```typescript
   const useMockService = true; // Defina como true para usar o mock
   ```

2. Execute o script para iniciar apenas o frontend:
   ```
   start-frontend.bat
   ```

3. O navegador abrirá automaticamente em http://localhost:4200

## Opção 2: Iniciar com Banco de Dados PostgreSQL (Neon)

Para usar o banco de dados real:

1. Abra o arquivo `src/app/app.config.ts` e altere para:
   ```typescript
   const useMockService = false; // Defina como false para usar o serviço real
   ```

2. Inicie o backend primeiro:
   ```
   start-backend.bat
   ```

3. Em outra janela de comando, inicie o frontend:
   ```
   start-frontend.bat
   ```

4. Acesse o frontend em http://localhost:4200
   Acesse o backend em http://localhost:3000

## Opção 3: Iniciar Tudo de Uma Vez

Para iniciar o frontend e o backend simultaneamente:

```
start-app.bat
```

## Solução de Problemas

Se encontrar o erro "Cannot GET /":

1. Verifique se você está acessando a URL correta: http://localhost:4200
2. O erro "Cannot GET /" geralmente aparece quando você acessa http://localhost:3000 diretamente, que é o backend.
3. Execute o script de verificação para diagnosticar problemas:
   ```
   check-angular.bat
   ```

## Páginas Disponíveis

- Home: http://localhost:4200/home
- Agendamento: http://localhost:4200/agendamento
- Admin: http://localhost:4200/admin