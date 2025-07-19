import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatabaseService, Servico, Cliente, Agendamento } from '../../services/database.service';
import { SERVICOS_FIXOS } from './servicos-fixos';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoComponent implements OnInit {
  // Usar serviços fixos diretamente
  servicos: Servico[] = SERVICOS_FIXOS;
  mensagem = '';
  mensagemTipo = '';
  carregando = false;
  agendamentoForm!: FormGroup;
  dataMinima: string;

  cliente: Cliente = {
    nome: '',
    email: '',
    telefone: ''
  };

  agendamento: Agendamento = {
    cliente_id: 0,
    servico_id: 0,
    data_agendada: '',
    hora_agendada: '',
    observacoes: ''
  };

  constructor(private dbService: DatabaseService, private fb: FormBuilder) {
    // Define a data mínima como hoje no formato YYYY-MM-DD
    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    console.log('Serviços disponíveis:', this.servicos);
  }

  // Função para verificar se a data selecionada é domingo
  verificarDomingo(event: Event): void {
    const target = event.target as HTMLInputElement;
    const dataStr = target.value;
    
    if (dataStr) {
      const [ano, mes, dia] = dataStr.split('-').map(Number);
      const data = new Date(ano, mes - 1, dia);
      const diaDaSemana = data.getDay();
      
      console.log(`Data selecionada: ${dataStr}, dia da semana: ${diaDaSemana}`);
      
      // Se for domingo (0), limpar o campo e mostrar alerta
      if (diaDaSemana === 0) {
        target.value = '';
        this.agendamentoForm.get('data_agendada')?.setValue('');
        this.mensagem = 'Não realizamos atendimentos aos domingos. Por favor, escolha outro dia.';
        this.mensagemTipo = 'erro';
      }
    }
  }

  // Validador personalizado para permitir apenas letras e espaços no nome
  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasNumbers = /[0-9]/.test(value);
    return hasNumbers ? { containsNumbers: true } : null;
  }
  
  // Validador avançado para garantir que o nome esteja no formato correto
  nomeCompletoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Verifica se contém apenas letras e espaços (incluindo letras acentuadas)
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(value)) {
      return { apenasLetras: true };
    }
    
    // Verifica se o nome tem pelo menos três palavras (nome e dois sobrenomes)
    const words = value.trim().split(/\s+/);
    if (words.length < 3) {
      return { doisSobrenomes: true };
    }
    
    // Verifica se cada palavra tem pelo menos 2 caracteres
    for (const word of words) {
      if (word.length < 2) {
        return { abreviacao: true };
      }
    }
    
    // Verifica se há repetições excessivas de caracteres iguais
    if (/([a-zA-ZÀ-ÿ])\1{2,}/.test(value)) {
      return { repeticaoCaracteres: true };
    }
    
    // Verifica se há palavras repetidas em qualquer posição
    const wordCounts: {[key: string]: number} = {};
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      wordCounts[lowerWord] = (wordCounts[lowerWord] || 0) + 1;
      if (wordCounts[lowerWord] > 1) {
        return { palavrasRepetidas: true };
      }
    }
    
    // Verifica se todas as palavras são iguais
    const todasPalavrasIguais = words.every((word: string) => 
      word.toLowerCase() === words[0].toLowerCase()
    );
    
    if (todasPalavrasIguais && words.length > 1) {
      return { todasPalavrasIguais: true };
    }
    
    // Verifica se há padrões repetitivos (como "bb bbb bbbb")
    const primeiraLetra = words[0].charAt(0).toLowerCase();
    const todasComecamIgual = words.every((word: string) => 
      word.charAt(0).toLowerCase() === primeiraLetra && 
      new Set(word.toLowerCase()).size === 1
    );
    
    if (todasComecamIgual && words.length > 1) {
      return { padraoRepetitivo: true };
    }
    
    // Verifica se há sequências aleatórias de letras (como "asdasd dasdasdasd")
    // Heurística: verifica se há muitas consoantes seguidas ou padrões repetitivos
    for (const word of words) {
      // Verifica se há mais de 4 consoantes seguidas
      if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word)) {
        return { sequenciaAleatoria: true };
      }
      
      // Verifica padrões repetitivos dentro da palavra
      const lowerWord = word.toLowerCase();
      for (let i = 0; i < lowerWord.length - 2; i++) {
        const pattern = lowerWord.substring(i, i + 2);
        if (lowerWord.indexOf(pattern, i + 2) !== -1) {
          return { padraoRepetitivoInterno: true };
        }
      }
    }
    
    // Verifica se o último sobrenome tem pelo menos 4 caracteres
    if (words[words.length - 1].length < 4) {
      return { sobrenomeCurto: true };
    }
    
    // Verifica se o penúltimo sobrenome tem pelo menos 4 caracteres
    if (words[words.length - 2].length < 4) {
      return { sobrenomeCurto: true };
    }
    
    // Verifica se o nome completo tem pelo menos 15 caracteres (sem contar espaços)
    const nomeCompletoSemEspacos = value.replace(/\s+/g, '');
    if (nomeCompletoSemEspacos.length < 15) {
      return { nomeMuitoCurto: true };
    }
    
    // Verifica se o nome não é apenas uma sequência aleatória de letras
    // Usamos uma heurística simples: se alguma palavra tem mais de 15 caracteres, provavelmente é inválida
    for (const word of words) {
      if (word.length > 15) {
        return { nomeInvalido: true };
      }
    }
    
    return null;
  }

  // Validador avançado para telefone
  telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Remove caracteres não numéricos para validar apenas os dígitos
    const numeroLimpo = value.replace(/[\s()-]/g, '');
    
    // Verifica se contém apenas números
    if (!/^\d+$/.test(numeroLimpo)) {
      return { containsNonNumbers: true };
    }
    
    // Verifica se tem o tamanho correto (11 dígitos para celular brasileiro)
    if (numeroLimpo.length !== 11) {
      return { tamanhoInvalido: true };
    }
    
    // Verifica se há repetições excessivas de dígitos
    if (/([0-9])\1{4,}/.test(numeroLimpo)) {
      return { repeticaoExcessiva: true };
    }
    
    // Verifica se todos os dígitos são iguais
    if (new Set(numeroLimpo).size === 1) {
      return { todosDigitosIguais: true };
    }
    
    // Verifica sequências crescentes ou decrescentes longas
    const sequenciaCrescente = '01234567890';
    const sequenciaDecrescente = '98765432109';
    
    for (let i = 0; i <= 6; i++) { // Verifica sequências de 5 dígitos
      const seqCres = sequenciaCrescente.substring(i, i + 5);
      const seqDecr = sequenciaDecrescente.substring(i, i + 5);
      
      if (numeroLimpo.includes(seqCres) || numeroLimpo.includes(seqDecr)) {
        return { sequenciaSimples: true };
      }
    }
    
    // Verifica DDD válido (simplificado)
    const ddd = numeroLimpo.substring(0, 2);
    if (ddd === '00' || ddd === '01' || parseInt(ddd) > 99) {
      return { dddInvalido: true };
    }
    
    return null;
  }
  
  // Validador para evitar datas passadas e domingos
  dataFuturaValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Criar a data a partir da string no formato YYYY-MM-DD
    const [ano, mes, dia] = value.split('-').map(Number);
    const dataEscolhida = new Date(ano, mes - 1, dia); // Meses em JS são 0-indexed
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas
    
    // Verificar se é data passada
    if (dataEscolhida < hoje) {
      return { dataPassada: true };
    }
    
    // Verificar se é domingo (0 = domingo, 1 = segunda, ..., 6 = sábado)
    const diaDaSemana = dataEscolhida.getDay();
    console.log(`Data escolhida: ${value}, dia da semana: ${diaDaSemana} (0=domingo, 1=segunda, ...)`);
    
    if (diaDaSemana === 0) {
      return { domingo: true };
    }
    
    return null;
  }

  initForm(): void {
    this.agendamentoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35), this.noNumbersValidator, this.nomeCompletoValidator]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/), this.telefoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      data_agendada: ['', [Validators.required, this.dataFuturaValidator]],
      hora_agendada: ['', [Validators.required]],
      servico_id: ['', [Validators.required]],
      observacoes: ['']
    });
  }

  onSubmit(): void {
    if (this.agendamentoForm.invalid) {
      this.agendamentoForm.markAllAsTouched();
      return;
    }
    
    this.carregando = true;
    this.mensagem = '';
    
    // Atualizar os objetos com os valores do formulário
    this.cliente.nome = this.agendamentoForm.get('nome')?.value;
    this.cliente.telefone = this.agendamentoForm.get('telefone')?.value;
    this.cliente.email = this.agendamentoForm.get('email')?.value;
    
    this.agendamento.data_agendada = this.agendamentoForm.get('data_agendada')?.value;
    this.agendamento.hora_agendada = this.agendamentoForm.get('hora_agendada')?.value;
    this.agendamento.servico_id = this.agendamentoForm.get('servico_id')?.value;
    this.agendamento.observacoes = this.agendamentoForm.get('observacoes')?.value;

    // Primeiro, criar o cliente
    this.dbService.addCliente(this.cliente).subscribe({
      next: (clienteResponse) => {
        // Depois de criar o cliente, criar o agendamento
        this.agendamento.cliente_id = clienteResponse.id!;
        
        this.dbService.createAgendamento(this.agendamento).subscribe({
          next: () => {
            this.mensagem = 'Pacto selado com sucesso! Sua alma... quer dizer, seu horário está confirmado.';
            this.mensagemTipo = 'sucesso';
            this.limparFormulario();
            this.carregando = false;
          },
          error: (err) => {
            console.error('Erro ao criar agendamento:', err);
            this.mensagem = 'As entidades do além rejeitaram seu agendamento. Tente novamente quando a lua estiver em outra posição.';
            this.mensagemTipo = 'erro';
            this.carregando = false;
          }
        });
      },
      error: (err) => {
        console.error('Erro ao criar cliente:', err);
        this.mensagem = 'Os espíritos não reconheceram suas informações. Verifique seus dados e tente novamente.';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }

  limparFormulario(): void {
    this.agendamentoForm.reset();
    
    this.cliente = {
      nome: '',
      email: '',
      telefone: ''
    };

    this.agendamento = {
      cliente_id: 0,
      servico_id: 0,
      data_agendada: '',
      hora_agendada: '',
      observacoes: ''
    };
  }
  
  // Métodos auxiliares para validação no template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.agendamentoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  getErrorMessage(fieldName: string): string {
    const field = this.agendamentoForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) return 'Este campo é obrigatório';
    if (field.hasError('minlength')) return 'Informação muito curta';
    if (field.hasError('maxlength')) return 'Máximo de 35 caracteres permitidos';
    if (field.hasError('email')) return 'E-mail inválido';
    if (field.hasError('containsNumbers')) return 'Não pode conter números';
    if (field.hasError('pattern')) return 'Formato inválido. Use (XX) XXXXX-XXXX';
    if (field.hasError('tamanhoInvalido')) return 'O telefone deve ter 11 dígitos';
    if (field.hasError('repeticaoExcessiva')) return 'Telefone inválido: muitos dígitos repetidos';
    if (field.hasError('todosDigitosIguais')) return 'Telefone inválido: todos os dígitos são iguais';
    if (field.hasError('sequenciaSimples')) return 'Telefone inválido: sequência numérica simples';
    if (field.hasError('dddInvalido')) return 'DDD inválido';
    if (field.hasError('doisSobrenomes')) return 'Digite nome e dois sobrenomes completos';
    if (field.hasError('abreviacao')) return 'Cada parte do nome deve ter pelo menos 2 letras';
    if (field.hasError('sobrenomeCurto')) return 'Sobrenomes muito curtos, digite sobrenomes completos';
    if (field.hasError('nomeMuitoCurto')) return 'Nome completo muito curto, digite nome e dois sobrenomes completos';
    if (field.hasError('apenasLetras')) return 'Use apenas letras e espaços no nome';
    if (field.hasError('repeticaoCaracteres')) return 'Evite repetições excessivas de caracteres';
    if (field.hasError('palavrasRepetidas')) return 'Evite palavras repetidas em sequência';
    if (field.hasError('todasPalavrasIguais')) return 'Nome inválido: todas as palavras são iguais';
    if (field.hasError('padraoRepetitivo')) return 'Nome inválido: padrão repetitivo detectado';
    if (field.hasError('sequenciaAleatoria')) return 'Nome inválido: sequência de letras não parece um nome real';
    if (field.hasError('padraoRepetitivoInterno')) return 'Nome inválido: padrões repetitivos detectados';
    if (field.hasError('nomeInvalido')) return 'Nome inválido, verifique o formato';
    if (field.hasError('dataPassada')) return 'Não é possível agendar para datas passadas';
    if (field.hasError('domingo')) return 'Não realizamos atendimentos aos domingos';
    
    return 'Campo inválido';
  }
  
  // Bloqueia números no campo de nome
  onlyLettersInput(event: KeyboardEvent): boolean {
    const pattern = /[A-Za-zÀ-ÖØ-öø-ÿ\s]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  
  // Formata o telefone automaticamente no padrão (XX) XXXXX-XXXX
  onlyNumbersInput(event: KeyboardEvent): boolean {
    // Permite apenas números
    if (!/^\d$/.test(String.fromCharCode(event.charCode)) && event.charCode !== 0) {
      event.preventDefault();
      return false;
    }
    
    // Formata o telefone enquanto digita
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/\D/g, ''); // Remove não-dígitos
      
      if (value.length <= 11) {
        let formattedValue = '';
        
        if (value.length > 0) formattedValue = '(' + value.substring(0, 2);
        if (value.length > 2) formattedValue += ') ' + value.substring(2, 7);
        if (value.length > 7) formattedValue += '-' + value.substring(7, 11);
        
        // Atualiza o valor do campo e do FormControl
        input.value = formattedValue;
        this.agendamentoForm.get('telefone')?.setValue(formattedValue, {emitEvent: false});
      }
    }, 0);
    
    return true;
  }
}