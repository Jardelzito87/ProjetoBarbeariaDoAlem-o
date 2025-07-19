import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatabaseService, Servico, Cliente, Agendamento } from '../../services/database.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoComponent implements OnInit {
  servicos: Servico[] = [];
  mensagem = '';
  mensagemTipo = '';
  carregando = false;
  agendamentoForm!: FormGroup;

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

  constructor(private dbService: DatabaseService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.carregarServicos();
    this.initForm();
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

  // Validador personalizado para permitir apenas números no telefone
  onlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasNonNumbers = /[^0-9]/.test(value.replace(/[\s()-]/g, ''));
    return hasNonNumbers ? { containsNonNumbers: true } : null;
  }

  initForm(): void {
    this.agendamentoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35), this.noNumbersValidator, this.nomeCompletoValidator]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      data_agendada: ['', [Validators.required]],
      hora_agendada: ['', [Validators.required]],
      servico_id: ['', [Validators.required]],
      observacoes: ['']
    });
  }

  carregarServicos(): void {
    this.carregando = true;
    this.dbService.getServicos().subscribe({
      next: (data) => {
        this.servicos = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
        this.mensagem = 'O grimório de serviços está temporariamente inacessível. Os espíritos estão trabalhando para resolver o problema.';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
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