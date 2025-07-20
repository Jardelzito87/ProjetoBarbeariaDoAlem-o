import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService, Agendamento, Servico, Cliente, DataBloqueada, LogAgendamento } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  servicos: Servico[] = [];
  clientes: Cliente[] = [];
  carregando = false;
  carregandoClientes = false;
  carregandoLogs = false;
  mensagem = '';
  mensagemTipo = '';
  bloqueioForm!: FormGroup;
  dataHoje: string;
  filtroAtual: string = 'pendentes';
  mostrarClientes = false;
  
  // Contadores de agendamentos por status
  contadorPendentes = 0;
  contadorConfirmados = 0;
  contadorFeitos = 0;
  contadorCancelados = 0;
  
  // Datas bloqueadas
  datasBloqueadas: DataBloqueada[] = [];
  
  // Logs de agendamentos
  logsAgendamentos: LogAgendamento[] = [];
  mostrarLogs = false;
  
  // Autenticação
  adminLogado: any = null;
  exibindoMenuUsuario = false;

  constructor(
    private dbService: DatabaseService, 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Define a data de hoje no formato YYYY-MM-DD
    const hoje = new Date();
    this.dataHoje = hoje.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.adminLogado = this.authService.getAdminLogado();
    this.carregarServicos();
    this.carregarAgendamentos();
    this.carregarClientes();
    this.carregarDatasBloqueadas();
    this.carregarLogsAgendamentos();
    this.initForm();
  }
  
  carregarLogsAgendamentos(): void {
    this.carregandoLogs = true;
    this.dbService.getLogsAgendamentos().subscribe({
      next: (logs: LogAgendamento[]) => {
        this.logsAgendamentos = logs;
        console.log('Logs de agendamentos carregados:', this.logsAgendamentos.length);
        this.carregandoLogs = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar logs de agendamentos:', err);
        this.carregandoLogs = false;
        this.mensagem = 'Erro ao carregar histórico de alterações';
        this.mensagemTipo = 'erro';
      }
    });
  }
  
  carregarDatasBloqueadas(): void {
    this.dbService.getDatasBloqueadas().subscribe({
      next: (datas: DataBloqueada[]) => {
        this.datasBloqueadas = datas;
        console.log('Datas bloqueadas:', this.datasBloqueadas);
      },
      error: (err: any) => {
        console.error('Erro ao carregar datas bloqueadas:', err);
      }
    });
  }
  
  carregarClientes(): void {
    this.carregandoClientes = true;
    this.dbService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('Clientes carregados:', this.clientes);
        this.carregandoClientes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.carregandoClientes = false;
        this.mensagem = 'Erro ao carregar clientes';
        this.mensagemTipo = 'erro';
      }
    });
  }
  
  toggleMostrarClientes(): void {
    this.mostrarClientes = !this.mostrarClientes;
  }
  
  toggleMostrarLogs(): void {
    this.mostrarLogs = !this.mostrarLogs;
  }

  initForm(): void {
    this.bloqueioForm = this.fb.group({
      data: ['', [Validators.required]],
      motivo: ['']
    });
  }

  carregarAgendamentos(): void {
    this.carregando = true;
    this.dbService.getAgendamentos().subscribe({
      next: (data) => {
        console.log('Agendamentos recebidos:', data);
        
        if (!data || data.length === 0) {
          console.log('Nenhum agendamento recebido');
          this.mensagem = 'Nenhum agendamento encontrado';
          this.mensagemTipo = 'erro';
          this.carregando = false;
          return;
        }
        
        // Forçar a conversão de tipos para garantir que todos os campos sejam reconhecidos
        const agendamentosConvertidos = data.map(agendamento => ({
          id: agendamento.id,
          cliente_id: agendamento.cliente_id,
          servico_id: agendamento.servico_id,
          data_agendada: agendamento.data_agendada,
          hora_agendada: agendamento.hora_agendada,
          observacoes: agendamento.observacoes || '',
          status: agendamento.status || 'pendente',
          cliente_nome: agendamento.cliente_nome || '',
          cliente_email: agendamento.cliente_email || '',
          cliente_telefone: agendamento.cliente_telefone || '',
          servico_nome: agendamento.servico_nome || '',
          servico_preco: agendamento.servico_preco || 0
        }));
        
        // Ordenar agendamentos por data e hora
        this.agendamentos = agendamentosConvertidos.sort((a, b) => {
          // Primeiro por status (pendentes primeiro)
          if (a.status === 'pendente' && b.status !== 'pendente') return -1;
          if (a.status !== 'pendente' && b.status === 'pendente') return 1;
          
          // Depois por data (mais recente primeiro)
          const dataComparacao = new Date(b.data_agendada).getTime() - new Date(a.data_agendada).getTime();
          if (dataComparacao !== 0) return dataComparacao;
          
          // Por último por hora (mais cedo primeiro)
          return a.hora_agendada.localeCompare(b.hora_agendada);
        });
        
        // Contar agendamentos por status
        this.contarAgendamentosPorStatus();
        
        // Aplicar filtro atual
        this.aplicarFiltro(this.filtroAtual);
        
        console.log('Agendamentos processados:', this.agendamentos);
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos:', err);
        this.mensagem = 'Erro ao carregar agendamentos';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }
  
  aplicarFiltro(filtro: string): void {
    this.filtroAtual = filtro;
    console.log('Aplicando filtro:', filtro);
    console.log('Agendamentos disponíveis:', this.agendamentos);
    
    if (filtro === 'todos') {
      this.agendamentosFiltrados = [...this.agendamentos];
    } else {
      this.agendamentosFiltrados = this.agendamentos.filter(a => {
        if (filtro === 'pendentes') {
          return a.status === 'pendente';
        } else if (filtro === 'confirmados') {
          return a.status === 'confirmado';
        } else if (filtro === 'feitos') {
          return a.status === 'concluido';
        } else if (filtro === 'cancelados') {
          return a.status === 'cancelado' || a.status === 'não compareceu';
        }
        return true;
      });
    }
    
    console.log('Resultado do filtro:', this.agendamentosFiltrados);
  }

  carregarServicos(): void {
    this.dbService.getServicos().subscribe({
      next: (data) => {
        this.servicos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
      }
    });
  }

  getNomeServico(servicoId: number): string {
    // Valores fixos para garantir que o nome seja exibido corretamente
    switch(servicoId) {
      case 1: return 'Corte Sobrenatural';
      case 2: return 'Degradê Espectral';
      case 3: return 'Navalha Demoníaca';
      case 4: return 'Barba Maldita';
      case 5: return 'Pacto Completo';
      case 6: return 'Transformação Sombria';
      default: return 'Serviço não encontrado';
    }
  }
  
  getPrecoServico(servicoId: number): number {
    // Valores fixos para garantir que o preço seja exibido corretamente
    switch(servicoId) {
      case 1: return 45.00;
      case 2: return 55.00;
      case 3: return 65.00;
      case 4: return 40.00;
      case 5: return 90.00;
      case 6: return 120.00;
      default: return 0;
    }
  }

  contarAgendamentosPorStatus(): void {
    this.contadorPendentes = this.agendamentos.filter(a => a.status === 'pendente').length;
    this.contadorConfirmados = this.agendamentos.filter(a => a.status === 'confirmado').length;
    this.contadorFeitos = this.agendamentos.filter(a => a.status === 'concluido').length;
    this.contadorCancelados = this.agendamentos.filter(a => a.status === 'cancelado' || a.status === 'não compareceu').length;
  }
  
  atualizarStatus(agendamento: Agendamento, novoStatus: string): void {
    this.carregando = true;
    console.log('🔄 Iniciando atualização de status...');
    console.log('📋 Dados:', { agendamentoId: agendamento.id, statusAtual: agendamento.status, novoStatus });
    
    // Verificar se tem token válido
    const token = localStorage.getItem('admin-token');
    if (!token) {
      console.error('❌ Token não encontrado');
      this.mensagem = 'Erro de autenticação. Faça login novamente.';
      this.mensagemTipo = 'erro';
      this.carregando = false;
      return;
    }
    
    // Atualizar no banco de dados
    this.dbService.atualizarStatusAgendamento(agendamento.id!, novoStatus).subscribe({
      next: (agendamentoAtualizado: Agendamento) => {
        console.log('✅ Status atualizado com sucesso:', agendamentoAtualizado);
        
        // Atualizar o agendamento na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = {
            ...agendamentoAtualizado,
            servico_nome: this.getNomeServico(agendamentoAtualizado.servico_id),
            servico_preco: this.getPrecoServico(agendamentoAtualizado.servico_id)
          };
          console.log('📝 Lista local atualizada');
        } else {
          console.warn('⚠️ Agendamento não encontrado na lista local');
        }
        
        // Atualizar contadores
        this.contarAgendamentosPorStatus();
        
        // Recarregar logs de agendamentos
        this.carregarLogsAgendamentos();
        
        this.mensagem = `Status atualizado para ${this.getStatusLabel(novoStatus)}`;
        this.mensagemTipo = 'sucesso';
        
        // Reaplicar o filtro atual
        this.aplicarFiltro(this.filtroAtual);
        
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('❌ Erro ao atualizar status:', err);
        console.error('📊 Status HTTP:', err.status);
        console.error('📄 Mensagem:', err.error);
        
        if (err.status === 401) {
          this.mensagem = 'Sessão expirada. Faça login novamente.';
          this.authService.clearLocalData();
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          this.mensagem = `Erro: ${err.error.error || 'Status inválido'}`;
        } else {
          this.mensagem = `Erro ao atualizar status: ${err.error?.error || 'Erro interno'}`;
        }
        
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }

  bloquearData(): void {
    if (this.bloqueioForm.invalid) {
      return;
    }

    const data = this.bloqueioForm.get('data')?.value;
    const motivo = this.bloqueioForm.get('motivo')?.value;

    this.carregando = true;
    this.dbService.bloquearData(data, motivo).subscribe({
      next: () => {
        this.mensagem = 'Data bloqueada com sucesso';
        this.mensagemTipo = 'sucesso';
        this.bloqueioForm.reset();
        this.carregarDatasBloqueadas(); // Recarregar datas bloqueadas
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao bloquear data:', err);
        this.mensagem = 'Erro ao bloquear data';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }
  
  desbloquearData(data: string): void {
    this.carregando = true;
    this.dbService.desbloquearData(data).subscribe({
      next: () => {
        this.mensagem = 'Data desbloqueada com sucesso';
        this.mensagemTipo = 'sucesso';
        this.carregarDatasBloqueadas(); // Recarregar datas bloqueadas
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao desbloquear data:', err);
        this.mensagem = 'Erro ao desbloquear data';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }

  formatarData(data: string): string {
    if (!data) return '';
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
  
  formatarHora(hora: string): string {
    // Converte formato 'HH:MM:SS' para 'HH:MM'
    return hora.substring(0, 5);
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'pendente': return 'status-pendente';
      case 'confirmado': return 'status-confirmado';
      case 'concluido': return 'status-concluido';
      case 'cancelado': return 'status-cancelado';
      case 'não compareceu': return 'status-nao-compareceu';
      default: return '';
    }
  }
  
  getStatusLabel(status: string): string {
    switch(status) {
      case 'pendente': return 'Pendente';
      case 'confirmado': return 'Confirmado';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'não compareceu': return 'Não Compareceu';
      default: return status;
    }
  }
  
  // ============= MÉTODOS DE AUTENTICAÇÃO =============
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu && !userMenu.contains(target)) {
      this.exibindoMenuUsuario = false;
    }
  }
  
  toggleMenuUsuario(): void {
    this.exibindoMenuUsuario = !this.exibindoMenuUsuario;
  }
  
  logout(): void {
    this.carregando = true;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no logout:', error);
        // Mesmo com erro, fazer logout local
        this.authService.clearLocalData();
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }
}