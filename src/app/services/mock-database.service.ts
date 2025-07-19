import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Servico, Cliente, Agendamento } from './database.service';

// Interface para simular o armazenamento persistente
interface MockStorage {
  servicos: Servico[];
  clientes: Cliente[];
  agendamentos: Agendamento[];
  datas_bloqueadas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MockDatabaseService {
  // Mock data
  private storage: MockStorage;
  private nextClienteId: number;
  private nextAgendamentoId: number;

  constructor() {
    // Tentar carregar dados do localStorage
    const savedData = localStorage.getItem('barbeariaDoAlemData');
    
    if (savedData) {
      // Se existirem dados salvos, carregá-los
      this.storage = JSON.parse(savedData);
      
      // Encontrar o próximo ID disponível para clientes
      this.nextClienteId = this.storage.clientes.length > 0 ?
        Math.max(...this.storage.clientes.map(c => c.id || 0)) + 1 : 1;
      
      // Encontrar o próximo ID disponível para agendamentos
      this.nextAgendamentoId = this.storage.agendamentos.length > 0 ?
        Math.max(...this.storage.agendamentos.map(a => a.id || 0)) + 1 : 1;
    } else {
      // Inicializar com dados padrão
      this.storage = {
        servicos: [
          { id: 1, nome: 'Corte Sobrenatural', descricao: 'Transformação completa com técnicas ancestrais. Inclui ritual de purificação capilar', preco: 45.00 },
          { id: 2, nome: 'Degradê Espectral', descricao: 'Fade perfeito com transições invisíveis. Realizado com tesouras forjadas em metal do além', preco: 55.00 },
          { id: 3, nome: 'Navalha Demoníaca', descricao: 'Precisão sobrenatural com nossa navalha ritual. Inclui massagem craniana com óleos místicos', preco: 65.00 },
          { id: 4, nome: 'Barba Maldita', descricao: 'Modelagem completa da barba com produtos infernais. Inclui toalha quente e óleo de barba especial', preco: 40.00 },
          { id: 5, nome: 'Pacto Completo', descricao: 'Combo de corte e barba com direito a ritual completo. Inclui bebida e tratamento especial', preco: 90.00 },
          { id: 6, nome: 'Transformação Sombria', descricao: 'Mudança radical de visual com direito a coloração e tratamento capilar das trevas', preco: 120.00 }
        ],
        clientes: [],
        agendamentos: [],
        datas_bloqueadas: []
      };
      
      this.nextClienteId = 1;
      this.nextAgendamentoId = 1;
      
      // Salvar os dados iniciais
      this.saveData();
    }
  }
  
  // Método para persistir dados no localStorage
  private saveData(): void {
    localStorage.setItem('barbeariaDoAlemData', JSON.stringify(this.storage));
  }

  // Serviços
  getServicos(): Observable<Servico[]> {
    // Simulate API delay
    return of(this.storage.servicos).pipe(delay(800));
  }

  // Clientes
  addCliente(cliente: Cliente): Observable<Cliente> {
    // Verificar se o cliente já existe com o mesmo email
    const clienteExistente = this.storage.clientes.find(c => c.email === cliente.email);
    
    if (clienteExistente) {
      // Se o cliente já existe, retorna o cliente existente
      return of(clienteExistente).pipe(delay(800));
    }
    
    // Simulate API delay
    const newCliente = { ...cliente, id: this.nextClienteId++ };
    this.storage.clientes.push(newCliente);
    this.saveData();
    return of(newCliente).pipe(delay(800));
  }

  // Agendamentos
  createAgendamento(agendamento: Agendamento): Observable<Agendamento> {
    // Validate required fields
    if (!agendamento.cliente_id || !agendamento.servico_id || !agendamento.data_agendada || !agendamento.hora_agendada) {
      return throwError(() => new Error('Todos os campos são obrigatórios'));
    }

    // Verificar se a data está bloqueada
    if (this.storage.datas_bloqueadas.includes(agendamento.data_agendada)) {
      return throwError(() => new Error('Data bloqueada para agendamento'));
    }

    // Verificar se já existe agendamento no mesmo horário
    const agendamentoExistente = this.storage.agendamentos.find(
      a => a.data_agendada === agendamento.data_agendada && 
           a.hora_agendada === agendamento.hora_agendada &&
           a.status !== 'cancelado'
    );

    if (agendamentoExistente) {
      return throwError(() => new Error('Horário já está ocupado'));
    }
    
    // Verificar se o cliente já tem agendamento no mesmo dia
    const agendamentoClienteMesmoDia = this.storage.agendamentos.find(
      a => a.cliente_id === agendamento.cliente_id && 
           a.data_agendada === agendamento.data_agendada &&
           a.status !== 'cancelado'
    );
    
    if (agendamentoClienteMesmoDia) {
      return throwError(() => new Error('Você já possui um agendamento neste dia. Escolha outra data.'));
    }
    
    // Verificar se já atingiu o limite de 7 agendamentos por dia (1 em cada horário)
    const agendamentosNoDia = this.storage.agendamentos.filter(
      a => a.data_agendada === agendamento.data_agendada && a.status !== 'cancelado'
    );
    
    if (agendamentosNoDia.length >= 7) {
      return throwError(() => new Error('Limite de agendamentos para este dia atingido. Por favor, escolha outra data.'));
    }

    // Simulate API delay
    const newAgendamento = { 
      ...agendamento, 
      id: this.nextAgendamentoId++,
      status: 'pendente'
    };
    
    this.storage.agendamentos.push(newAgendamento);
    this.saveData();
    return of(newAgendamento).pipe(delay(800));
  }
  
  // Listar agendamentos
  getAgendamentos(): Observable<Agendamento[]> {
    return of(this.storage.agendamentos).pipe(delay(800));
  }
  
  // Verificar disponibilidade de horários para uma data
  verificarDisponibilidade(data: string): Observable<{horario: string, disponivel: boolean}[]> {
    const horarios = [
      '09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'
    ];
    
    // Encontrar agendamentos para a data especificada
    const agendamentosNaData = this.storage.agendamentos.filter(
      a => a.data_agendada === data && a.status !== 'cancelado'
    );
    
    // Mapear horários ocupados
    const horariosOcupados = agendamentosNaData.map(a => a.hora_agendada);
    
    // Criar lista de disponibilidade
    const disponibilidade = horarios.map(horario => ({
      horario,
      disponivel: !horariosOcupados.includes(horario)
    }));
    
    return of(disponibilidade).pipe(delay(800));
  }
  
  // Bloquear data
  bloquearData(data: string, motivo?: string): Observable<{success: boolean}> {
    if (!this.storage.datas_bloqueadas.includes(data)) {
      this.storage.datas_bloqueadas.push(data);
      this.saveData();
    }
    return of({success: true}).pipe(delay(800));
  }
  
  // Desbloquear data
  desbloquearData(data: string): Observable<{success: boolean}> {
    const index = this.storage.datas_bloqueadas.indexOf(data);
    if (index !== -1) {
      this.storage.datas_bloqueadas.splice(index, 1);
      this.saveData();
    }
    return of({success: true}).pipe(delay(800));
  }
  
  // Atualizar status do agendamento
  atualizarStatusAgendamento(id: number, status: string): Observable<Agendamento> {
    const agendamento = this.storage.agendamentos.find(a => a.id === id);
    
    if (!agendamento) {
      return throwError(() => new Error('Agendamento não encontrado'));
    }
    
    agendamento.status = status;
    this.saveData();
    return of(agendamento).pipe(delay(800));
  }
}