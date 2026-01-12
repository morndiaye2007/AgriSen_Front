import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {Parcelle} from "../../../../core/models/Parcelle";

Chart.register(...registerables);

interface ParcelleStats {
  totalParcelles: number;
  parcellesActives: number;
  parcellesInactives: number;
  superficieTotale: number;
  superficieMoyenne: number;
  culturesEnCours: number;
  parcellesAvecCulture: number;
  tauxUtilisation: number;
  repartitionSol: Array<{
    type: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  repartitionSourceEau: Array<{
    type: string;
    count: number;
    superficie: number;
    percentage: number;
    color: string;
  }>;
  repartitionVille: Array<{
    nom: string;
    count: number;
    superficie: number;
  }>;
}

@Component({
  selector: 'app-parcelle-stats',
  templateUrl: './parcelle-stats.component.html',
  styleUrls: ['./parcelle-stats.component.scss']
})
export class ParcelleStatsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() parcelles: Parcelle[] = [];

  stats: ParcelleStats = {
    totalParcelles: 0,
    parcellesActives: 0,
    parcellesInactives: 0,
    superficieTotale: 0,
    superficieMoyenne: 0,
    culturesEnCours: 0,
    parcellesAvecCulture: 0,
    tauxUtilisation: 0,
    repartitionSol: [],
    repartitionSourceEau: [],
    repartitionVille: []
  };

  solTypeChart: any;
  evolutionChart: any;

  ngOnInit(): void {
    this.calculateStats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelles'] && !changes['parcelles'].firstChange) {
      this.calculateStats();
      this.updateCharts();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  calculateStats(): void {
    if (!this.parcelles || this.parcelles.length === 0) {
      return;
    }

    // Stats de base
    this.stats.totalParcelles = this.parcelles.length;
    this.stats.parcellesActives = this.parcelles.filter(p => p.active).length;
    this.stats.parcellesInactives = this.parcelles.filter(p => !p.active).length;
    this.stats.superficieTotale = this.parcelles.reduce((sum, p) => sum + p.superficie, 0);
    this.stats.superficieMoyenne = this.stats.superficieTotale / this.stats.totalParcelles;
    this.stats.parcellesAvecCulture = this.parcelles.filter(p => p.cultureId).length;
    this.stats.culturesEnCours = this.parcelles.filter(p => p.cultureId && p.active).length;
    this.stats.tauxUtilisation = (this.stats.parcellesAvecCulture / this.stats.totalParcelles) * 100;

    // Répartition par type de sol
    this.calculateSolDistribution();

    // Répartition par source d'eau
    this.calculateSourceEauDistribution();

    // Répartition par ville
    this.calculateVilleDistribution();
  }

  calculateSolDistribution(): void {
    const solTypes = new Map<string, number>();
    const colors = ['#8BC34A', '#4CAF50', '#FFC107', '#FF9800', '#795548'];

    this.parcelles.forEach(p => {
      if (p.typeSol) {
        solTypes.set(p.typeSol, (solTypes.get(p.typeSol) || 0) + 1);
      }
    });

    this.stats.repartitionSol = Array.from(solTypes.entries()).map(([type, count], index) => ({
      type,
      count,
      percentage: Math.round((count / this.stats.totalParcelles) * 100),
      color: colors[index % colors.length]
    }));
  }

  calculateSourceEauDistribution(): void {
    const sources = new Map<string, { count: number; superficie: number }>();
    const colors = ['#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];

    this.parcelles.forEach(p => {
      if (p.sourceEau) {
        const current = sources.get(p.sourceEau) || { count: 0, superficie: 0 };
        sources.set(p.sourceEau, {
          count: current.count + 1,
          superficie: current.superficie + p.superficie
        });
      }
    });

    this.stats.repartitionSourceEau = Array.from(sources.entries()).map(([type, data], index) => ({
      type,
      count: data.count,
      superficie: data.superficie,
      percentage: Math.round((data.count / this.stats.totalParcelles) * 100),
      color: colors[index % colors.length]
    }));
  }

  calculateVilleDistribution(): void {
    const villes = new Map<string, { count: number; superficie: number }>();

    this.parcelles.forEach(p => {
      if (p.ville) {
        const current = villes.get(p.ville) || { count: 0, superficie: 0 };
        villes.set(p.ville, {
          count: current.count + 1,
          superficie: current.superficie + p.superficie
        });
      }
    });

    this.stats.repartitionVille = Array.from(villes.entries())
      .map(([nom, data]) => ({
        nom,
        count: data.count,
        superficie: data.superficie
      }))
      .sort((a, b) => b.count - a.count);
  }

  initCharts(): void {
    this.createSolTypeChart();
    this.createEvolutionChart();
  }

  createSolTypeChart(): void {
    const canvas = document.getElementById('solTypeChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.solTypeChart) {
      this.solTypeChart.destroy();
    }

    this.solTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.stats.repartitionSol.map(s => s.type),
        datasets: [{
          data: this.stats.repartitionSol.map(s => s.count),
          backgroundColor: this.stats.repartitionSol.map(s => s.color),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = this.stats.totalParcelles;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  createEvolutionChart(): void {
    const canvas = document.getElementById('evolutionChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.evolutionChart) {
      this.evolutionChart.destroy();
    }

    // Données simulées pour l'évolution (à remplacer par de vraies données)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = this.generateEvolutionData();

    this.evolutionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Superficie cultivée (ha)',
          data: data,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => value + ' ha'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  generateEvolutionData(): number[] {
    // Générer des données basées sur les parcelles actuelles
    const baseValue = this.stats.superficieTotale;
    return Array.from({ length: 12 }, (_, i) => {
      const variation = Math.random() * 0.2 - 0.1; // Variation de ±10%
      return Math.max(0, baseValue * (1 + variation));
    });
  }

  updateCharts(): void {
    if (this.solTypeChart) {
      this.solTypeChart.data.labels = this.stats.repartitionSol.map(s => s.type);
      this.solTypeChart.data.datasets[0].data = this.stats.repartitionSol.map(s => s.count);
      this.solTypeChart.data.datasets[0].backgroundColor = this.stats.repartitionSol.map(s => s.color);
      this.solTypeChart.update();
    }

    if (this.evolutionChart) {
      this.evolutionChart.data.datasets[0].data = this.generateEvolutionData();
      this.evolutionChart.update();
    }
  }
}
