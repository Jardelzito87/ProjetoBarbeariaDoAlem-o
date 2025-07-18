import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Servico, Cliente, Agendamento } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class MockDatabaseService {
  // Mock data
  private servicos: Servico[] = [
    { id: 1, nome: 'Corte Sobrenatural', descricao: 'Transformação completa com técnicas ancestrais. Inclui ritual de purificação capilar', preco: 45.00 },
    { id: 2, nome: 'Degradê Espectral', descricao: 'Fade perfeito com transições invisíveis. Realizado com tesouras forjadas em metal do além', preco: 55.00 },
    { id: 3, nome: 'Navalha Demoníaca', descricao: 'Precisão sobrenatural com nossa navalha ritual. Inclui massagem craniana com óleos místicos', preco: 65.00 },
    { id: 4, nome: 'Barba Maldita', descricao: 'Modelagem completa da barba com produtos infernais. Inclui toalha quente e óleo de barba especial', preco: 40.00 },
    { id: 5, nome: 'Pacto Completo', descricao: 'Combo de corte e barba com direito a ritual completo. Inclui bebida e tratamento especial', preco: 90.00 },
    { id: 6, nome: 'Transformação Sombria', descricao: 'Mudança radical de visual com direito a coloração e tratamento capilar das trevas', preco: 120.00 }
  ];

  private clientes: Cliente[] = [];
  private agendamentos: Agendamento[] = [];
  private nextClienteId = 1;
  private nextAgendamentoId = 1;

  constructor() { }

  // Serviços
  getServicos(): Observable<Servico[]> {
    // Simulate API delay
    return of(this.servicos).pipe(delay(800));
  }

  // Clientes
  addCliente(cliente: Cliente): Observable<Cliente> {
    // Simulate API delay
    const newCliente = { ...cliente, id: this.nextClienteId++ };
    this.clientes.push(newCliente);
    return of(newCliente).pipe(delay(800));
  }

  // Agendamentos
  createAgendamento(agendamento: Agendamento): Observable<Agendamento> {
    // Validate required fields
    if (!agendamento.cliente_id || !agendamento.servico_id || !agendamento.data_agendada || !agendamento.hora_agendada) {
      return throwError(() => new Error('Todos os campos são obrigatórios'));
    }

    // Simulate API delay
    const newAgendamento = { 
      ...agendamento, 
      id: this.nextAgendamentoId++,
      status: 'pendente'
    };
    
    this.agendamentos.push(newAgendamento);
    return of(newAgendamento).pipe(delay(800));
  }
}