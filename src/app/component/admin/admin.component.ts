import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService, Agendamento, Servico } from '../../services/database.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  servicos: Servico[] = [];
  carregando = false;
  mensagem = '';
  mensagemTipo = '';
  bloqueioForm!: FormGroup;
  dataHoje: string;

  constructor(private dbService: DatabaseService, private fb: FormBuilder) {
    // Define a data de hoje no formato YYYY-MM-DD
    const hoje = new Date();
    this.dataHoje = hoje.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.carregarAgendamentos();
    this.carregarServicos();
    this.initForm();
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
        this.agendamentos = data;
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
    const servico = this.servicos.find(s => s.id === servicoId);
    return servico ? servico.nome : 'Serviço não encontrado';
  }

  atualizarStatus(agendamento: Agendamento, novoStatus: string): void {
    this.carregando = true;
    this.dbService.atualizarStatusAgendamento(agendamento.id!, novoStatus).subscribe({
      next: () => {
        agendamento.status = novoStatus;
        this.mensagem = `Status atualizado para ${novoStatus}`;
        this.mensagemTipo = 'sucesso';
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        this.mensagem = 'Erro ao atualizar status';
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

  formatarData(data: string): string {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
}