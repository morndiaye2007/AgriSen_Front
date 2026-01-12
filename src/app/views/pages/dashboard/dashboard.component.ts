import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from "../../../core/models/Utilisateur";
import { Parcelle } from "../../../core/models/Parcelle";
import { JournalEntry } from "../../../core/models/JournalEntry";
import { Meteo } from "../../../core/models/Meteo";
import { TypeActivite } from "../../../core/models/TypeActivite";
import { DashboardStats } from "../../../core/models/DashboardStats";
import { ActivityCalendar } from "../../../core/models/ActivityCalendar";
import { ParcelleService } from "../../../services/parcelle.service";
import { JournalService } from "../../../services/journal.service";
import { NotificationService } from "../../../services/notification.service";
import { MeteoService } from "../../../services/meteo.service";
import {AppNotification} from "../../../core/models/Notification";
import {AuthService} from "../../../services/auth.service";
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
class DashboardComponent implements OnInit, OnDestroy {
  user: Utilisateur | null = null;
  stats: DashboardStats = {
    totalParcelles: 0,
    surfaceTotale: 0,
    activitesRecentes: 0,
    alertesActives: 0,
    rendementTotal: 0,
    revenuProjet: 0,
    santeGlobale: 0
  };


  parcelles: Parcelle[] = [];
  recentActivities: JournalEntry[] = [];
  notifications: AppNotification[] = [];  // ✅ Utiliser AppNotification au lieu de Notification
  currentMeteo: Meteo | null = null;
  meteoForecast: Meteo[] = [];

  currentMonth: Date = new Date();
  calendarDays: ActivityCalendar[] = [];

  selectedSeason = '2024';
  loading = true;

  // Pour les filtres du calendrier
  activityFilters = [
    { type: TypeActivite.SEMIS, label: 'Semis', color: '#4CAF50', active: true },
    { type: TypeActivite.IRRIGATION, label: 'Irrigation', color: '#2196F3', active: true },
    { type: TypeActivite.RECOLTE, label: 'Récolte', color: '#FF9800', active: true },
    { type: TypeActivite.TRAITEMENT_PHYTOSANITAIRE, label: 'Traitement', color: '#9C27B0', active: true },
    { type: TypeActivite.APPLICATION_ENGRAIS, label: 'Engrais', color: '#8BC34A', active: true }
  ];

  constructor(
    private authService: AuthService,
    private parcelleService: ParcelleService,
    private journalService: JournalService,
    private notificationService: NotificationService,
    private meteoService: MeteoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    // Charger les parcelles
    this.parcelleService.getAllParcelles().subscribe({
      next: (parcelles) => {
        this.parcelles = parcelles.filter(p => p.active);
        this.stats.totalParcelles = this.parcelles.length;
        this.stats.surfaceTotale = this.parcelles.reduce((sum, p) => sum + p.superficie, 0);
      },
      error: (err) => console.error('Erreur chargement parcelles:', err)
    });

    // Charger les activités récentes
    this.journalService.getAllEntries().subscribe({
      next: (entries) => {
        this.recentActivities = entries
          .sort((a, b) => new Date(b.dateActivite).getTime() - new Date(a.dateActivite).getTime())
          .slice(0, 10);

        this.stats.activitesRecentes = entries.filter(e =>
          this.isRecent(new Date(e.dateActivite))
        ).length;

        this.generateCalendar();
      },
      error: (err) => console.error('Erreur chargement activités:', err)
    });

    // Charger les notifications
    if (this.user?.id) {
      this.notificationService.getNotificationsByUser(this.user.id).subscribe({
        next: (notifications) => {
          this.notifications = notifications
            .filter(n => !n.lu)
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 5);

          this.stats.alertesActives = this.notifications.length;
        },
        error: (err) => console.error('Erreur chargement notifications:', err)
      });
    }

    // Charger la météo
    if (this.user?.ville || this.parcelles.length > 0) {
      const latitude = this.parcelles[0]?.latitude || 14.7167;
      const longitude = this.parcelles[0]?.longitude || -17.4677;

      this.meteoService.getCurrentWeather(latitude, longitude).subscribe({
        next: (weather) => {
          this.currentMeteo = weather;
        },
        error: (err) => console.error('Erreur chargement météo:', err)
      });

      this.meteoService.getWeatherForecast(latitude, longitude).subscribe({
        next: (forecast) => {
          this.meteoForecast = forecast.slice(0, 5);
        },
        error: (err) => console.error('Erreur chargement prévisions:', err)
      });
    }

    this.loading = false;
  }

  isRecent(date: Date): boolean {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.calendarDays = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const activities = this.recentActivities.filter(activity => {
        const actDate = new Date(activity.dateActivite);
        return actDate.getDate() === day &&
          actDate.getMonth() === month &&
          actDate.getFullYear() === year &&
          this.isActivityVisible(activity.typeActivite);
      });

      this.calendarDays.push({ date, activities });
    }
  }

  isActivityVisible(type: TypeActivite): boolean {
    const filter = this.activityFilters.find(f => f.type === type);
    return filter ? filter.active : false;
  }

  toggleFilter(filter: any): void {
    filter.active = !filter.active;
    this.generateCalendar();
  }

  changeMonth(delta: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + delta
    );
    this.generateCalendar();
  }

  onSeasonChange(): void {
    // Recharger les données pour la saison sélectionnée
    this.loadDashboardData();
  }

  changeSeason(direction: 'previous' | 'next'): void {
    // Logique pour changer de saison
    console.log('Change season:', direction);
  }

  viewAllAlerts(): void {
    this.router.navigate(['/notifications']);
  }

  getActivityIcon(type: TypeActivite): string {
    const icons: { [key in TypeActivite]: string } = {
      [TypeActivite.PREPARATION_SOL]: 'fas fa-tractor',
      [TypeActivite.SEMIS]: 'fas fa-seedling',
      [TypeActivite.IRRIGATION]: 'fas fa-tint',
      [TypeActivite.APPLICATION_ENGRAIS]: 'fas fa-flask',
      [TypeActivite.TRAITEMENT_PHYTOSANITAIRE]: 'fas fa-spray-can',
      [TypeActivite.DESHERBAGE]: 'fas fa-broom',
      [TypeActivite.RECOLTE]: 'fas fa-warehouse',
      [TypeActivite.AUTRE]: 'fas fa-ellipsis-h'
    };
    return icons[type] || 'fas fa-circle';
  }

  getActivityColor(type: TypeActivite): string {
    const filter = this.activityFilters.find(f => f.type === type);
    return filter?.color || '#9E9E9E';
  }

  getWeatherIcon(condition?: string): string {
    if (!condition) return 'fas fa-cloud';

    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('soleil') || conditionLower.includes('clair')) {
      return 'fas fa-sun';
    } else if (conditionLower.includes('nuage')) {
      return 'fas fa-cloud';
    } else if (conditionLower.includes('pluie')) {
      return 'fas fa-cloud-rain';
    } else if (conditionLower.includes('orage')) {
      return 'fas fa-bolt';
    }
    return 'fas fa-cloud';
  }

  get currentSeason(): string {
    return `Saison ${this.selectedSeason}`;
  }

  userName: string = '';

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }




rendementChartData: ChartData<'bar'> = {
  labels: ['Mil', 'Riz', 'Maïs'],
  datasets: [
    {
      label: 'Rendement (T)',
      data: [12, 18, 9]
    }
  ]
};

rendementChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

previsionVenteData: ChartData<'line'> = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Ventes prévues',
      data: [200000, 250000, 300000, 320000, 350000, 400000]
    }
  ]
};

}

export default DashboardComponent
