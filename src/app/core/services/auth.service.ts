import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User, UserRole } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // SIMULATION - À remplacer par l'appel HTTP réel quand le backend sera prêt
    // return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap(response => {
    //     this.storageService.setToken(response.token);
    //     this.storageService.setUser(response.user);
    //     this.currentUserSubject.next(response.user);
    //   })
    // );

    // Simulation avec délai pour rendre l'expérience plus réaliste
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      firstName: 'Moussa',
      lastName: 'Diop',
      phone: '771234567',
      role: UserRole.AGRICULTEUR,
      region: 'Dakar',
      farmName: 'Ferme de Teranga',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser,
      expiresIn: 3600
    };

    return of(mockResponse).pipe(
      delay(1000), // Simule un délai réseau de 1 seconde
      tap(response => {
        this.storageService.setToken(response.token);
        this.storageService.setUser(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    // SIMULATION - À remplacer par l'appel HTTP réel quand le backend sera prêt
    // return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
    //   tap(response => {
    //     this.storageService.setToken(response.token);
    //     this.storageService.setUser(response.user);
    //     this.currentUserSubject.next(response.user);
    //   })
    // );

    // Simulation avec délai pour rendre l'expérience plus réaliste
    const mockUser: User = {
      id: '1',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      region: data.region,
      farmName: data.farmName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser,
      expiresIn: 3600
    };

    return of(mockResponse).pipe(
      delay(1000), // Simule un délai réseau de 1 seconde
      tap(response => {
        this.storageService.setToken(response.token);
        this.storageService.setUser(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    // SIMULATION - À remplacer par l'appel HTTP réel quand le backend sera prêt
    // return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
    
    return of({ message: 'Un email de réinitialisation a été envoyé à votre adresse.' }).pipe(
      delay(1000)
    );
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    // SIMULATION - À remplacer par l'appel HTTP réel quand le backend sera prêt
    // return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { token, password });
    
    return of({ message: 'Votre mot de passe a été réinitialisé avec succès.' }).pipe(
      delay(1000)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getToken() && !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private loadUserFromStorage(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }
}

