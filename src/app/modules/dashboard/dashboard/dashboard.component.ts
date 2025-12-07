import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // KPIs
  totalParcelles = 4;
  totalRendement = 12.5; // tonnes
  revenuProjete = 7500000; // XOF
  santeChamps = 92; // %

  // Données pour graphiques
  rendementParCulture = [
    { name: 'Mil', value: 4.5 },
    { name: 'Arachides', value: 3.2 },
    { name: 'Mangues', value: 2.8 },
    { name: 'Niébé', value: 1.5 },
    { name: 'Sorgho', value: 0.5 }
  ];

  evolutionRendement = [
    { name: 'Jan', value: 2.5 },
    { name: 'Fév', value: 3.1 },
    { name: 'Mar', value: 3.8 },
    { name: 'Avr', value: 4.2 },
    { name: 'Mai', value: 4.5 },
    { name: 'Juin', value: 5.1 }
  ];

  // Chart configurations
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rendement (tonnes)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Culture'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rendement (tonnes)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Chart data
  public barChartData: ChartData<'bar'> = {
    labels: this.rendementParCulture.map(c => c.name),
    datasets: [
      {
        data: this.rendementParCulture.map(c => c.value),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  public lineChartData: ChartData<'line'> = {
    labels: this.evolutionRendement.map(e => e.name),
    datasets: [
      {
        data: this.evolutionRendement.map(e => e.value),
        label: 'Rendement',
        fill: true,
        tension: 0.3,
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 0.8)'
      }
    ]
  };

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  alertes = [
    {
      type: 'warning',
      icon: 'warning',
      titre: 'Risque élevé de nuisibles',
      description: 'Détecté dans le Champ B. Inspection recommandée.'
    },
    {
      type: 'info',
      icon: 'water_drop',
      titre: 'Irrigation nécessaire',
      description: 'Le Champ C est en dessous du seuil d\'humidité optimal.'
    },
    {
      type: 'success',
      icon: 'event',
      titre: 'Récolte des mangues',
      description: 'Le moment optimal approche dans 5 jours.'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}

