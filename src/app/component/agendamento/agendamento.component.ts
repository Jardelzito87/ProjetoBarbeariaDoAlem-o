import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService, Servico, Cliente, Agendamento } from '../../services/database.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoComponent implements OnInit {
  servicos: Servico[] = [];
  mensagem = '';
  mensagemTipo = '';
  carregando = false;

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

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.carregarServicos();
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
        this.mensagem = 'Erro ao carregar serviços. Por favor, tente novamente mais tarde.';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }

  onSubmit(): void {
    this.carregando = true;
    this.mensagem = '';

    // Primeiro, criar o cliente
    this.dbService.addCliente(this.cliente).subscribe({
      next: (clienteResponse) => {
        // Depois de criar o cliente, criar o agendamento
        this.agendamento.cliente_id = clienteResponse.id!;
        
        this.dbService.createAgendamento(this.agendamento).subscribe({
          next: () => {
            this.mensagem = 'Agendamento realizado com sucesso!';
            this.mensagemTipo = 'sucesso';
            this.limparFormulario();
            this.carregando = false;
          },
          error: (err) => {
            console.error('Erro ao criar agendamento:', err);
            this.mensagem = 'Erro ao criar agendamento. Por favor, tente novamente.';
            this.mensagemTipo = 'erro';
            this.carregando = false;
          }
        });
      },
      error: (err) => {
        console.error('Erro ao criar cliente:', err);
        this.mensagem = 'Erro ao criar cliente. Por favor, tente novamente.';
        this.mensagemTipo = 'erro';
        this.carregando = false;
      }
    });
  }

  limparFormulario(): void {
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
}