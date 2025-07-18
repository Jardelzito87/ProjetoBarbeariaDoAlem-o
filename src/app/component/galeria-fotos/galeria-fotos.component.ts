import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GaleriaItem {
  imagem: string;
  titulo: string;
  descricao: string;
  categoria: string;
}

@Component({
  selector: 'app-galeria-fotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria-fotos.component.html',
  styleUrl: './galeria-fotos.component.css'
})
export class GaleriaFotosComponent {
  categoriaAtual: string = 'todos';
  
  itensGaleria: GaleriaItem[] = [
    {
      imagem: 'https://i.postimg.cc/DzWHSK4r/download-1.jpg',
      titulo: 'Corte Moderno',
      descricao: 'Estilo contemporâneo com acabamento perfeito',
      categoria: 'cortes'
    },
    {
      imagem: 'https://i.postimg.cc/133LZF9Y/download-4.jpg',
      titulo: 'Barba Estilizada',
      descricao: 'Definição e contorno para destacar seu estilo',
      categoria: 'barbas'
    },
    {
      imagem: 'https://i.postimg.cc/dQ8MRvHn/download-2.jpg',
      titulo: 'Corte Clássico',
      descricao: 'Elegância atemporal para qualquer ocasião',
      categoria: 'cortes'
    },
    {
      imagem: 'https://i.postimg.cc/tJbMvZSk/Freddie.jpg',
      titulo: 'Estilo Retrô',
      descricao: 'Inspirado nos clássicos que nunca saem de moda',
      categoria: 'barbas'
    },
    {
      imagem: 'https://i.postimg.cc/NfY3pVZt/opvoeden-aleid-truijens-getty-images.jpg',
      titulo: 'Corte Degradê',
      descricao: 'Transição perfeita para um visual moderno',
      categoria: 'cortes'
    },
    {
      imagem: 'https://i.postimg.cc/gJ87KqDr/Samuel-L-Jackson.jpg',
      titulo: 'Estilo Exclusivo',
      descricao: 'Personalidade e atitude em cada detalhe',
      categoria: 'especiais'
    }
  ];

  get itensFiltrados(): GaleriaItem[] {
    if (this.categoriaAtual === 'todos') {
      return this.itensGaleria;
    }
    return this.itensGaleria.filter(item => item.categoria === this.categoriaAtual);
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaAtual = categoria;
  }
}