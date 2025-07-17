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
    { id: 1, nome: 'Social', descricao: 'Corte tradicional, bem alinhado. Laterais curtas e topo médio. Estilo ideal para ambientes formais.', preco: 25.00 },
    { id: 2, nome: 'Degradê (Fade)', descricao: 'Laterais raspadas com transição suave para o topo. Inclui: Low, Mid, High e Skin fade.', preco: 30.00 },
    { id: 3, nome: 'Corte na Navalha', descricao: 'Feito com navalha para dar textura. Ideal para quem tem cabelo grosso.', preco: 40.00 }
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