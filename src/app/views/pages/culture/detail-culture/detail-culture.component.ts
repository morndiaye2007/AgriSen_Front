import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Culture} from "../../../../core/models/Culture";
import {Parcelle} from "../../../../core/models/Parcelle";
import {JournalEntry} from "../../../../core/models/JournalEntry";
import {CultureService} from "../../../../services/culture.service";
import {ParcelleService} from "../../../../services/parcelle.service";
import {JournalService} from "../../../../services/journal.service";
import {TypeActivite} from "../../../../core/models/TypeActivite";


interface UsageStats {
  parcellesCount: number;
  totalSuperficie: number;
  activitiesCount: number;
  averageYield: number;
}

@Component({
  selector: 'app-detail-culture',
  templateUrl: './detail-culture.component.html',
  styleUrls: ['./detail-culture.component.scss']
})
export class DetailCultureComponent implements OnInit {
  culture: Culture | null = null;
  cultureId: number | null = null;
  loading = true;

  parcellesWithCulture: Parcelle[] = [];
  recentActivities: JournalEntry[] = [];

  usageStats: UsageStats = {
    parcellesCount: 0,
    totalSuperficie: 0,
    activitiesCount: 0,
    averageYield: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cultureService: CultureService,
    private parcelleService: ParcelleService,
    private journalService: JournalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.cultureId = parseInt(id);
      this.loadCultureDetails();
    } else {
      this.loading = false;
    }
  }

  loadCultureDetails(): void {
    if (!this.cultureId) return;

    this.loading = true;

    // Charger la culture
    this.cultureService.getCultureById(this.cultureId).subscribe({
      next: (culture) => {
        this.culture = culture;
        this.loadRelatedData();
      },
      error: (err) => {
        console.error('Erreur chargement culture:', err);
        this.loading = false;
      }
    });
  }

  loadRelatedData(): void {
    if (!this.cultureId) return;

    // Charger les parcelles avec cette culture
    this.parcelleService.getParcellesByCulture(this.cultureId).subscribe({
      next: (parcelles) => {
        this.parcellesWithCulture = parcelles;
        this.calculateStats();
        this.loadActivities();
      },
      error: (err) => {
        console.error('Erreur chargement parcelles:', err);
        this.loading = false;
      }
    });
  }

  loadActivities(): void {
    // Charger les activités pour les parcelles de cette culture
    const parcelleIds = this.parcellesWithCulture.map(p => p.id!);

    if (parcelleIds.length === 0) {
      this.loading = false;
      return;
    }

    this.journalService.getAllEntries().subscribe({
      next: (entries) => {
        this.recentActivities = entries
          .filter(e => parcelleIds.includes(e.parcelleId))
          .sort((a, b) => new Date(b.dateActivite).getTime() - new Date(a.dateActivite).getTime())
          .slice(0, 10);

        this.usageStats.activitiesCount = entries.filter(e => parcelleIds.includes(e.parcelleId)).length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement activités:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.usageStats.parcellesCount = this.parcellesWithCulture.length;
    this.usageStats.totalSuperficie = this.parcellesWithCulture.reduce((sum, p) => sum + p.superficie, 0);
    // Rendement simulé (à remplacer par de vraies données)
    this.usageStats.averageYield = 2500 + Math.random() * 1000;
  }

  getCategorieColor(): string {
    const colors: { [key: string]: string } = {
      'Céréales': '#FFA726',
      'Légumineuses': '#66BB6A',
      'Tubercules': '#8D6E63',
      'Légumes': '#26A69A',
      'Fruits': '#EF5350',
      'Cultures industrielles': '#5C6BC0',
      'Fourragères': '#9CCC65'
    };
    return colors[this.culture?.categorie || ''] || '#9E9E9E';
  }

  getCategorieIcon(): string {
    const icons: { [key: string]: string } = {
      'Céréales': 'fa-wheat-awn',
      'Légumineuses': 'fa-seedling',
      'Tubercules': 'fa-carrot',
      'Légumes': 'fa-leaf',
      'Fruits': 'fa-apple-whole',
      'Cultures industrielles': 'fa-industry',
      'Fourragères': 'fa-cow'
    };
    return icons[this.culture?.categorie || ''] || 'fa-plant-wilt';
  }

  getActivityIcon(type: TypeActivite): string {
    const icons: { [key in TypeActivite]: string } = {
      [TypeActivite.PREPARATION_SOL]: 'fa-tractor',
      [TypeActivite.SEMIS]: 'fa-seedling',
      [TypeActivite.IRRIGATION]: 'fa-tint',
      [TypeActivite.APPLICATION_ENGRAIS]: 'fa-flask',
      [TypeActivite.TRAITEMENT_PHYTOSANITAIRE]: 'fa-spray-can',
      [TypeActivite.DESHERBAGE]: 'fa-broom',
      [TypeActivite.RECOLTE]: 'fa-warehouse',
      [TypeActivite.AUTRE]: 'fa-ellipsis-h'
    };
    return icons[type];
  }

  getActivityColor(type: TypeActivite): string {
    const colors: { [key in TypeActivite]: string } = {
      [TypeActivite.PREPARATION_SOL]: '#8D6E63',
      [TypeActivite.SEMIS]: '#4CAF50',
      [TypeActivite.IRRIGATION]: '#2196F3',
      [TypeActivite.APPLICATION_ENGRAIS]: '#8BC34A',
      [TypeActivite.TRAITEMENT_PHYTOSANITAIRE]: '#9C27B0',
      [TypeActivite.DESHERBAGE]: '#FFC107',
      [TypeActivite.RECOLTE]: '#FF9800',
      [TypeActivite.AUTRE]: '#9E9E9E'
    };
    return colors[type];
  }

  getActivityLabel(type: TypeActivite): string {
    const labels: { [key in TypeActivite]: string } = {
      [TypeActivite.PREPARATION_SOL]: 'Préparation du sol',
      [TypeActivite.SEMIS]: 'Semis',
      [TypeActivite.IRRIGATION]: 'Irrigation',
      [TypeActivite.APPLICATION_ENGRAIS]: 'Application d\'engrais',
      [TypeActivite.TRAITEMENT_PHYTOSANITAIRE]: 'Traitement phytosanitaire',
      [TypeActivite.DESHERBAGE]: 'Désherbage',
      [TypeActivite.RECOLTE]: 'Récolte',
      [TypeActivite.AUTRE]: 'Autre'
    };
    return labels[type];
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-culture.jpg';
  }

  goBack(): void {
    this.router.navigate(['/cultures']);
  }

  editCulture(): void {
    if (this.cultureId) {
      this.router.navigate(['/cultures/edit', this.cultureId]);
    }
  }

  deleteCulture(): void {
    if (!this.culture || !this.cultureId) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer "${this.culture.nom}" ?`)) {
      this.cultureService.deleteCulture(this.cultureId).subscribe({
        next: () => {
          alert('Culture supprimée avec succès');
          this.router.navigate(['/cultures']);
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de la culture');
        }
      });
    }
  }

  viewParcelle(parcelle: Parcelle): void {
    this.router.navigate(['/parcelles', parcelle.id]);
  }

  viewAllActivities(): void {
    this.router.navigate(['/journal'], {
      queryParams: { cultureId: this.cultureId }
    });
  }
}
