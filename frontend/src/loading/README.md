# 📁 Loading Screen - Barbearia do Além

Esta pasta contém os arquivos relacionados à tela de carregamento inicial da aplicação.

## 📄 Arquivos:

### `loading.html`
- **Propósito**: Página principal que exibe a tela de carregamento
- **Funcionalidade**: Mostra informações do sistema enquanto o Angular carrega
- **Referências**: Importa o `loading.css` para estilização

### `loading.css` 
- **Propósito**: Estilos específicos para a tela de carregamento
- **Recursos**: Animações, gradientes, spinner, responsividade
- **Integração**: Usado pelo `loading.html` através de link rel="stylesheet"

## 🎯 Organização:

Ambos os arquivos estão na mesma pasta para:
- ✅ **Clareza**: Fica evidente que trabalham juntos
- ✅ **Manutenção**: Fácil localização dos arquivos relacionados
- ✅ **Organização**: Separação lógica do loading do resto da aplicação

## 🔗 Como usar:

1. O `loading.html` é carregado primeiro
2. Ele importa o `loading.css` (mesmo diretório) 
3. Exibe a tela de loading com animações
4. Quando o Angular carrega, o conteúdo é substituído

---
*Criado em: 21/07/2025*
*Estrutura: loading.html + loading.css na mesma pasta*
