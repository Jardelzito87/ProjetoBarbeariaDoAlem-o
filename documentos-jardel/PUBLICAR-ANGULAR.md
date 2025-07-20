# Instruções de Deployment da Barbearia do Além

## 1. Publicar o Frontend Angular na Vercel

A Vercel é ideal para projetos frontend.

### Passos:

1. Acesse: https://vercel.com e crie uma conta (use seu GitHub).

2. Suba seu projeto Angular no GitHub (caso ainda não tenha feito).

3. No Vercel:
   - Clique em "Add New Project"
   - Conecte ao repositório Angular.
   - Ele detecta o Angular automaticamente.

4. Configure se precisar:
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/browser`

5. Clique em Deploy.

## 2. Publicar o Backend Node.js no Render

O Render é ideal para backend gratuito e aceita conexão com o Neon.

### Passos:

1. Vá para https://render.com e crie uma conta.

2. Suba seu backend Node.js no GitHub.

3. No Render:
   - Clique em "New Web Service"
   - Escolha o repositório do backend.

4. Configure:
   - Runtime: Node
   - Start command: `npm start` (ou o comando de inicialização do seu package.json)
   - Build command: `npm install`
   - Environment: Node

5. Adicione variável de ambiente com a string de conexão do Neon:
   - Nome: `DATABASE_URL`
   - Valor: a string fornecida pelo Neon, por exemplo:
     ```
     postgresql://neondb_owner:senha@ep-host-pooler.sa-east-1.aws.neon.tech/barbeariadoalem_db?sslmode=require&channel_binding=require
     ```

6. Clique em Create Web Service.

## 3. Conexão entre Frontend e Backend

O frontend já está configurado para se conectar ao backend através do arquivo `environment.prod.ts`.

Se você precisar alterar a URL do backend, edite o arquivo:
`src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-backend.onrender.com/api'
};
```

## Notas Importantes

- Certifique-se de que o CORS está configurado corretamente no backend para aceitar requisições do frontend hospedado na Vercel.
- Teste a aplicação após o deployment para garantir que tudo está funcionando corretamente.
- Lembre-se que serviços gratuitos como o Render podem "adormecer" após períodos de inatividade, causando lentidão na primeira requisição.