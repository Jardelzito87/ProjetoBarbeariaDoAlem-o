// Função para bloquear todos os domingos no calendário
function bloquearDomingos() {
  // Obter o elemento de input de data
  const inputData = document.getElementById('data');
  
  if (!inputData) return;
  
  // Adicionar um evento liste para quando o usuário clicar no calendário
  inputData.addEventListener('input', function() {
    const dataEscolhida = new Date(this.value);
    
    // Verificar se é domingo (0 = domingo, 1 = segunda, ..., 6 = sábado)
    if (dataEscolhida.getDay() === 0) {
      // Mostrar mensagem de erro
      alert('Não realizamos atendimentos aos domingos. Por favor, escolha outro dia.');
      
      // Limpar o campo
      this.value = '';
    }
  });
}

// Executar a função quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', bloquearDomingos);