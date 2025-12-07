import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const hasRole = expectedRoles.some(role => this.authService.hasRole(role));
    
    if (!hasRole) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

