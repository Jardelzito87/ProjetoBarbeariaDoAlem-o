import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Primeiro verificar se tem token no localStorage
    const token = localStorage.getItem('admin-token');
    if (!token) {
      console.log('Sem token. Redirecionando para login...');
      this.router.navigate(['/login']);
      return false;
    }

    // Se tem token, verificar se é válido no servidor
    return this.authService.checkAuthStatus().pipe(
      take(1),
      map(response => {
        if (response.authenticated) {
          console.log('✅ Token válido, acesso liberado');
          return true;
        } else {
          console.log('❌ Token inválido ou sessão expirada. Redirecionando para login...');
          this.authService.clearLocalData();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      // Tratar erros (servidor offline, token inválido, etc.)
      catchError((error: any) => {
        console.log('❌ Erro ao verificar autenticação:', error);
        this.authService.clearLocalData();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
