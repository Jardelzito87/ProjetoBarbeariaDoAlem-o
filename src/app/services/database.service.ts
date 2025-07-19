import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface Agendamento {
  id?: number;
  cliente_id: number;
  servico_id: number;
  data_agendada: string;
  hora_agendada: string;
  observacoes: string;
  status?: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  servico_nome?: string;
  servico_preco?: number;
}

export interface Disponibilidade {
  horario: string;
  disponivel: boolean;
}

export interface DataBloqueada {
  data: string;
  motivo?: string;
}

export interface LogAgendamento {
  id: number;
  agendamento_id: number;
  status_anterior: string | null;
  status_novo: string;
  alterado_por: string;
  criado_em: string;
  data_agendada: string;
  hora_agendada: string;
  cliente_nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3000/api'; // URL do backend

  constructor(private http: HttpClient) { }

  // Serviços
  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/servicos`);
  }

  // Clientes
  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }
  
  // Listar todos os clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  // Agendamentos
  createAgendamento(agendamento: Agendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/agendamentos`, agendamento);
  }
  
  // Listar agendamentos
  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos`);
  }
  
  // Bloquear data
  bloquearData(data: string, motivo?: string): Observable<{success: boolean}> {
    return this.http.post<{success: boolean}>(`${this.apiUrl}/datas-bloqueadas`, { data, motivo });
  }
  
  // Desbloquear data
  desbloquearData(data: string): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/datas-bloqueadas/${data}`);
  }
  
  // Obter datas bloqueadas
  getDatasBloqueadas(): Observable<DataBloqueada[]> {
    return this.http.get<DataBloqueada[]>(`${this.apiUrl}/datas-bloqueadas`);
  }
  
  // Atualizar status do agendamento
  atualizarStatusAgendamento(id: number, status: string): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/agendamentos/${id}`, { status });
  }
  
  // Verificar disponibilidade de horários para uma data
  verificarDisponibilidade(data: string): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(`${this.apiUrl}/disponibilidade?data=${data}`);
  }
  
  // Obter logs de agendamentos
  getLogsAgendamentos(): Observable<LogAgendamento[]> {
    return this.http.get<LogAgendamento[]>(`${this.apiUrl}/logs-agendamentos`);
  }
}