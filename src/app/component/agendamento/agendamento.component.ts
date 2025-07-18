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
        this.mensagem = 'O grimório de serviços está temporariamente inacessível. Os espíritos estão trabalhando para resolver o problema.';
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