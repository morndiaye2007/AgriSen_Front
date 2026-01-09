import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import {ParcelleService} from "../../../services/parcelle.service";
import {JournalService} from "../../../services/journal.service";
import {MeteoService} from "../../../services/meteo.service";
import {NotificationService} from "../../../services/notification.service";
import {AuthService} from "../../../auth.service";
import {Parcelle} from "../../../core/models/Parcelle";
import {JournalEntry} from "../../../core/models/JournalEntry";
import {Meteo} from "../../../core/models/Meteo";

interface DashboardStats {
  totalParcelles: number;
  superficieTotale: number;
  activitesRecentes: number;
  revenuProjet: number;
  rendementTotal: number;
  santéGlobale: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalParcelles: 0,
    superficieTotale: 0,
    activitesRecentes: 0,
    revenuProjet: 0,
    rendementTotal: 0,
    santéGlobale: 92
  };

  parcelles: Parcelle[] = [];
  recentActivities: JournalEntry[] = [];
  currentMeteo: Meteo | null = null;
  meteoForecast: Meteo[] = [];
  notifications: Notification[] = [];
  loading = true;
  userName = '';

  // Chart data
  rendementChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  rendementChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' T';
          }
        }
      }
    }
  };

  // Données de prévisions de vente
  previsionVenteData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  constructor(
    private parcelleService: ParcelleService,
    private journalService: JournalService,
    private meteoService: MeteoService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDashboardData();
  }

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = `${user.prenom} ${user.nom}`;
    }
  }

  loadDashboardData(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    // Charger les parcelles
    this.parcelleService.getParcellesByAgriculteur(user.id).subscribe({
      next: (parcelles) => {
        this.parcelles = parcelles;
        this.stats.totalParcelles = parcelles.length;
        this.stats.superficieTotale = parcelles.reduce((sum, p) => sum + (p.superficie || 0), 0);

        if (parcelles.length > 0 && parcelles[0].latitude && parcelles[0].longitude) {
          this.loadMeteo(parcelles[0].latitude, parcelles[0].longitude);
        }
      },
      error: (err) => console.error('Error loading parcelles:', err)
    });

    // Charger les activités récentes
    this.journalService.getAllEntries().subscribe({
      next: (entries) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        this.recentActivities = entries
          .filter(e => new Date(e.dateActivite) >= thirtyDaysAgo)
          .sort((a, b) => new Date(b.dateActivite).getTime() - new Date(a.dateActivite).getTime())
          .slice(0, 5);

        this.stats.activitesRecentes = this.recentActivities.length;
        this.prepareChartData(entries);
      },
      error: (err) => console.error('Error loading journal entries:', err)
    });

    // Charger les notifications
    this.notificationService.getUnreadNotifications(user.id).subscribe({
      next: (notifications) => {
        this.notifications = notifications.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.loading = false;
      }
    });

    // Calculer les statistiques fictives
    this.stats.revenuProjet = 7500000;
    this.stats.rendementTotal = 12.5;
  }

  loadMeteo(latitude: number, longitude: number): void {
    this.meteoService.getCurrentMeteo(latitude, longitude).subscribe({
      next: (meteo) => {
        this.currentMeteo = meteo;
      },
      error: (err) => console.error('Error loading meteo:', err)
    });

    this.meteoService.getForecast(latitude, longitude, 5).subscribe({
      next: (forecast) => {
        this.meteoForecast = forecast;
      },
      error: (err) => console.error('Error loading forecast:', err)
    });
  }

  prepareChartData(entries: JournalEntry[]): void {
    // Rendement par culture
    const cultures = ['Mil', 'Arachides', 'Mangues', 'Niébé', 'Sorgho'];
    const rendements = [2.5, 1.8, 3.2, 1.5, 2.0];

    this.rendementChartData = {
      labels: cultures,
      datasets: [{
        label: 'Rendement (Tonnes)',
        data: rendements,
        backgroundColor: [
          '#4ade80',
          '#fb923c',
          '#fbbf24',
          '#a78bfa',
          '#60a5fa'
        ],
        borderRadius: 8
      }]
    };

    // Prévisions de vente
    const months = ['Juin', 'Juillet', 'Août', 'Sept', 'Oct', 'Nov'];
    this.previsionVenteData = {
      labels: months,
      datasets: [{
        label: 'Ventes',
        data: [650, 590, 800, 810, 860, 900],
        fill: true,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }]
    };
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  markNotificationAsRead(notification: Notification): void {
    if (notification.id) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.lu = true;
        },
        error: (err) => console.error('Error marking notification as read:', err)
      });
    }
  }

  getActivityIcon(type: string): string {
    const icons: any = {
      'SEMIS': 'fa-seedling',
      'IRRIGATION': 'fa-tint',
      'RECOLTE': 'fa-wheat',
      'TRAITEMENT': 'fa-spray-can'
    };
    return icons[type] || 'fa-leaf';
  }
}
