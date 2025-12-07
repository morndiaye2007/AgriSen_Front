import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          this.toastr.error('Votre session a expiré. Veuillez vous reconnecter.', 'Session expirée');
        } else if (error.status === 403) {
          this.toastr.error('Vous n\'avez pas les permissions nécessaires.', 'Accès refusé');
        } else if (error.status === 404) {
          this.toastr.error('Ressource non trouvée.', 'Erreur');
        } else if (error.status >= 500) {
          this.toastr.error('Une erreur serveur est survenue. Veuillez réessayer plus tard.', 'Erreur serveur');
        } else if (error.error?.message) {
          this.toastr.error(error.error.message, 'Erreur');
        } else {
          this.toastr.error('Une erreur est survenue.', 'Erreur');
        }

        return throwError(() => error);
      })
    );
  }
}

