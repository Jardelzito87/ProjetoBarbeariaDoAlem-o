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
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = '/api'; // This would be replaced with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Serviços
  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/servicos`);
  }

  // Clientes
  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  // Agendamentos
  createAgendamento(agendamento: Agendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/agendamentos`, agendamento);
  }
}