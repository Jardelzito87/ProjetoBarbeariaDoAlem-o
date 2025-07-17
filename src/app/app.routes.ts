import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { QuemSomosComponent } from './component/quem-somos/quem-somos.component';
import { GaleriaFotosComponent } from './component/galeria-fotos/galeria-fotos.component';
import { AgendamentoComponent } from './component/agendamento/agendamento.component';
import { ContatoComponent } from './component/contato/contato.component';
import { NaoEncontradosComponent } from './component/nao-encontrados/nao-encontrados.component';

export const routes: Routes = [
    {path:'',component: HomeComponent},                  //rota principal
    {path:'home', component: HomeComponent},            //rota do componente home
    {path:'quem-somos', component: QuemSomosComponent},//rota do componente quem-somos
    {path:'galeria-fotos', component: GaleriaFotosComponent},//rota do componente galeria de fotos
    {path:'agendamento', component: AgendamentoComponent},//rota do componente agendamento
    {path:'contato', component: ContatoComponent},   //rota do componente contatos
    {path:'**', component: NaoEncontradosComponent},//rota para redirecionar paginas nao encontrada
];
