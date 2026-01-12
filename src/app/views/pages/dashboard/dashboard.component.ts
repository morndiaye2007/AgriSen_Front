import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartOptions, registerables } from 'chart.js';
import {AuthService} from "../../../services/auth.service";
import {ParcelleService} from "../../../services/parcelle.service";
import {JournalService} from "../../../services/journal.service";
import {NotificationService} from "../../../services/notification.service";
import {MeteoService} from "../../../services/meteo.service";
import {Utilisateur} from "../../../core/models/Utilisateur";
import {Parcelle} from "../../../core/models/Parcelle";
import {JournalEntry} from "../../../core/models/JournalEntry";
import {Meteo} from "../../../core/models/Meteo";
import {AppNotification} from "../../../core/models/Notification";


// Enregistrer Chart.js
Chart.register(...registerables);

interface DashboardStats {
  rendementTotal: number;
  revenuProjet: number;
  santeGlobale: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Utilisateur
  currentUser: Utilisateur | null = null;
  userName = '';

  // Statistiques
  stats: DashboardStats = {
    rendementTotal: 12.5,
    revenuProjet: 7500000,
    santeGlobale: 92
  };

  // Données
  parcelles: Parcelle[] = [];
  recentActivities: JournalEntry[] = [];
  notifications: AppNotification[] = []; // CHANGEMENT ICI
  currentMeteo: Meteo | null = null;
  meteoForecast: Meteo[] = [];

  // Charts
  rendementChart: Chart | null = null;
  previsionChart: Chart | null = null;

  // Chart Data
  rendementChartData: ChartData<'bar'> = {
    labels: ['Mil', 'Arachides', 'Mangues', 'Niébé', 'Sorgho'],
    datasets: [
      {
        label: 'Rendement 2024 (tonnes)',
        data: [3.2, 2.8, 4.1, 1.8, 2.6],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(33, 150, 243, 0.8)'
        ],
        borderColor: [
          'rgb(76, 175, 80)',
          'rgb(255, 152, 0)',
          'rgb(244, 67, 54)',
          'rgb(156, 39, 176)',
          'rgb(33, 150, 243)'
        ],
        borderWidth: 2,
        borderRadius: 8
      },
      {
        label: 'Rendement 2023 (tonnes)',
        data: [2.9, 2.5, 3.8, 1.5, 2.3],
        backgroundColor: 'rgba(158, 158, 158, 0.3)',
        borderColor: 'rgb(158, 158, 158)',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  rendementChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: '600'
          },
          padding: 16,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} tonnes`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: (value) => value + ' t'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '600'
          }
        }
      }
    }
  };

  previsionVenteData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Prévisions de vente (XOF)',
        data: [1200000, 1450000, 1380000, 1650000, 1890000, 2100000],
        borderColor: 'rgb(76, 175, 80)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(76, 175, 80)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Objectif',
        data: [1000000, 1200000, 1400000, 1600000, 1800000, 2000000],
        borderColor: 'rgb(158, 158, 158)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  loading = true;

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

  ngAfterViewInit(): void {
    // Initialiser les graphiques après que la vue soit chargée
    setTimeout(() => {
      this.initCharts();
    }, 500);
  }

  ngOnDestroy(): void {
    // Détruire les graphiques pour éviter les fuites mémoire
    if (this.rendementChart) {
      this.rendementChart.destroy();
    }
    if (this.previsionChart) {
      this.previsionChart.destroy();
    }
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userName = `${this.currentUser.prenom} ${this.currentUser.nom}`;
    } else {
      this.userName = 'Agriculteur';
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    // Charger les parcelles
    this.parcelleService.getAllParcelles().subscribe({
      next: (parcelles) => {
        this.parcelles = parcelles.filter(p => p.active);
        this.calculateStats();
      },
      error: (err) => console.error('Erreur chargement parcelles:', err)
    });

    // Charger les activités récentes
    this.journalService.getAllEntries().subscribe({
      next: (entries) => {
        this.recentActivities = entries
          .sort((a, b) => new Date(b.dateActivite).getTime() - new Date(a.dateActivite).getTime())
          .slice(0, 10);
      },
      error: (err) => console.error('Erreur chargement activités:', err)
    });

    // Charger les notifications
    if (this.currentUser?.id) {
      this.notificationService.getNotificationsByUser(this.currentUser.id).subscribe({
        next: (notifications) => {
          this.notifications = notifications
            .filter(n => !n.lu)
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 5);
        },
        error: (err) => console.error('Erreur chargement notifications:', err)
      });
    }

    // Charger la météo
    this.loadMeteo();

    this.loading = false;
  }

  loadMeteo(): void {
    // Utiliser la position de la première parcelle ou Dakar par défaut
    const latitude = this.parcelles[0]?.latitude || 14.7167;
    const longitude = this.parcelles[0]?.longitude || -17.4677;

    // Météo actuelle
    this.meteoService.getCurrentWeather(latitude, longitude).subscribe({
      next: (meteo) => {
        this.currentMeteo = meteo;
      },
      error: (err) => console.error('Erreur chargement météo:', err)
    });

    // Prévisions
    this.meteoService.getWeatherForecast(latitude, longitude).subscribe({
      next: (forecast) => {
        this.meteoForecast = forecast.slice(0, 5);
      },
      error: (err) => console.error('Erreur chargement prévisions:', err)
    });
  }

  calculateStats(): void {
    if (this.parcelles.length === 0) return;

    // Calculer le rendement total (simulé)
    this.stats.rendementTotal = this.parcelles.reduce((sum, p) => {
      return sum + (p.superficie * (2 + Math.random() * 2)); // Rendement simulé: 2-4 tonnes/ha
    }, 0);

    // Calculer le revenu projeté (simulé)
    const prixMoyen = 600000; // Prix moyen par tonne en XOF
    this.stats.revenuProjet = Math.round(this.stats.rendementTotal * prixMoyen);

    // Santé globale (simulée)
    this.stats.santeGlobale = Math.round(85 + Math.random() * 10);
  }

  initCharts(): void {
    this.createRendementChart();
    this.createPrevisionChart();
  }

  createRendementChart(): void {
    const canvas = document.querySelector('canvas[type="bar"]') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Canvas pour rendement non trouvé');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.rendementChart) {
      this.rendementChart.destroy();
    }

    this.rendementChart = new Chart(ctx, {
      type: 'bar',
      data: this.rendementChartData,
      options: this.rendementChartOptions
    });
  }

  createPrevisionChart(): void {
    const canvas = document.querySelector('canvas[type="line"]') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Canvas pour prévisions non trouvé');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.previsionChart) {
      this.previsionChart.destroy();
    }

    this.previsionChart = new Chart(ctx, {
      type: 'line',
      data: this.previsionVenteData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: '600'
              },
              padding: 16,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              },
              callback: (value) => {
                return this.formatCurrency(+value);
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11,
                weight: '600'
              }
            }
          }
        }
      }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Bonjour';
    } else if (hour < 18) {
      return 'Bon après-midi';
    } else {
      return 'Bonsoir';
    }
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M XOF';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K XOF';
    }
    return value + ' XOF';
  }

  // Navigation
  navigateToParcelles(): void {
    this.router.navigate(['/parcelles']);
  }

  navigateToJournal(): void {
    this.router.navigate(['/journal']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  // Gestion des notifications
  markNotificationAsRead(notification: AppNotification): void { // CHANGEMENT ICI
    if (notification.id) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.lu = true;
          // Pas de dateLecture dans votre interface AppNotification
        },
        error: (err) => console.error('Erreur marquage notification:', err)
      });
    }
  }

  deleteNotification(notification: AppNotification, event: Event): void { // CHANGEMENT ICI
    event.stopPropagation();
    if (notification.id && confirm('Supprimer cette notification ?')) {
      this.notificationService.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
        },
        error: (err) => console.error('Erreur suppression notification:', err)
      });
    }
  }

  // Météo
  getWeatherIcon(temperature: number): string {
    if (temperature > 35) {
      return 'fa-sun';
    } else if (temperature > 25) {
      return 'fa-cloud-sun';
    } else if (temperature > 15) {
      return 'fa-cloud';
    } else {
      return 'fa-cloud-rain';
    }
  }

  // Vidéos
  playVideo(videoId: string): void {
    console.log('Lecture vidéo:', videoId);
    // Implémenter la logique de lecture vidéo
  }
}
