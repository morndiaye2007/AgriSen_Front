import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  currentUser: User | null = null;
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Mes Parcelles', icon: 'agriculture', route: '/dashboard/parcelles' },
    { label: 'Journal de Culture', icon: 'book', route: '/dashboard/journal' },
    { label: 'Marketplace', icon: 'store', route: '/dashboard/marketplace' },
    { label: 'Financement', icon: 'account_balance', route: '/dashboard/financement' },
    { label: 'Profil', icon: 'person', route: '/dashboard/profil' }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

