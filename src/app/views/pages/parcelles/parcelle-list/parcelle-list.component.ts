import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelleFilters } from '../parcelle-filter/parcelle-filter.component';
import {Parcelle} from "../../../../core/models/Parcelle";
import {Culture} from "../../../../core/models/Culture";
import {ParcelleService} from "../../../../services/parcelle.service";
import {CultureService} from "../../../../services/culture.service";

interface Tab {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

@Component({
  selector: 'app-liste-parcelle',
  templateUrl: './list-parcelle.component.html',
  styleUrls: ['./list-parcelle.component.scss']
})
export class ListParcelleComponent implements OnInit {
  // Données
  parcelles: Parcelle[] = [];
  filteredParcelles: Parcelle[] = [];
  paginatedParcelles: Parcelle[] = [];
  cultures: Culture[] = [];
  villes: string[] = [];

  // Onglets
  tabs: Tab[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-chart-line' },
    { id: 'list', label: 'Liste', icon: 'fas fa-list', count: 0 },
    { id: 'map', label: 'Carte', icon: 'fas fa-map' }
  ];
  activeTab = 'dashboard';

  // Vue
  viewMode: 'grid' | 'table' = 'grid';

  // Tri
  sortBy = 'nom';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  pages: number[] = [];

  // Filtres
  currentFilters: ParcelleFilters | null = null;

  // Modal
  showModal = false;
  editMode = false;
  selectedParcelle: Parcelle | null = null;

  // États
  loading = true;

  constructor(
    private parcelleService: ParcelleService,
    private cultureService: CultureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Charger les parcelles
    this.parcelleService.getAllParcelles().subscribe({
      next: (parcelles) => {
        this.parcelles = parcelles;
        this.filteredParcelles = parcelles;
        this.extractVilles();
        this.sortParcelles();
        this.updatePagination();
        this.updateTabsCounts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement parcelles:', err);
        this.loading = false;
      }
    });

    // Charger les cultures
    this.cultureService.getAllCultures().subscribe({
      next: (cultures) => {
        this.cultures = cultures;
      },
      error: (err) => console.error('Erreur chargement cultures:', err)
    });
  }

  extractVilles(): void {
    const villesSet = new Set<string>();
    this.parcelles.forEach(p => {
      if (p.ville) {
        villesSet.add(p.ville);
      }
    });
    this.villes = Array.from(villesSet).sort();
  }

  onFiltersChange(filters: ParcelleFilters): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.currentFilters) {
      this.filteredParcelles = [...this.parcelles];
      return;
    }

    this.filteredParcelles = this.parcelles.filter(parcelle => {
      // Recherche textuelle
      if (this.currentFilters!.searchTerm) {
        const searchLower = this.currentFilters!.searchTerm.toLowerCase();
        const matchesSearch =
          parcelle.nom.toLowerCase().includes(searchLower) ||
          parcelle.description?.toLowerCase().includes(searchLower) ||
          parcelle.ville?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Filtre par culture
      if (this.currentFilters!.cultureId && parcelle.cultureId !== this.currentFilters!.cultureId) {
        return false;
      }

      // Filtre par type de sol
      if (this.currentFilters!.typeSol && parcelle.typeSol !== this.currentFilters!.typeSol) {
        return false;
      }

      // Filtre par source d'eau
      if (this.currentFilters!.sourceEau && parcelle.sourceEau !== this.currentFilters!.sourceEau) {
        return false;
      }

      // Filtre par superficie
      if (this.currentFilters!.superficieMin !== null && parcelle.superficie < this.currentFilters!.superficieMin) {
        return false;
      }
      if (this.currentFilters!.superficieMax !== null && parcelle.superficie > this.currentFilters!.superficieMax) {
        return false;
      }

      // Filtre par ville
      if (this.currentFilters!.ville && parcelle.ville !== this.currentFilters!.ville) {
        return false;
      }

      // Filtre par statut
      const showActive = this.currentFilters!.showActive;
      const showInactive = this.currentFilters!.showInactive;

      if (!showActive && parcelle.active) return false;
      if (!showInactive && !parcelle.active) return false;

      return true;
    });

    this.currentPage = 1;
    this.sortParcelles();
    this.updatePagination();
    this.updateTabsCounts();
  }

  sortParcelles(): void {
    this.filteredParcelles.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'nom':
          compareValue = a.nom.localeCompare(b.nom);
          break;
        case 'superficie':
          compareValue = a.superficie - b.superficie;
          break;
        case 'dateCreation':
          compareValue = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case 'ville':
          compareValue = (a.ville || '').localeCompare(b.ville || '');
          break;
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    this.updatePagination();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortParcelles();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredParcelles.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedParcelles = this.filteredParcelles.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  changeTab(tabId: string): void {
    this.activeTab = tabId;
  }

  updateTabsCounts(): void {
    const listTab = this.tabs.find(t => t.id === 'list');
    if (listTab) {
      listTab.count = this.filteredParcelles.length;
    }
  }

  get recentParcelles(): Parcelle[] {
    return this.filteredParcelles
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() -
        new Date(a.updatedAt || a.createdAt || 0).getTime())
      .slice(0, 6);
  }

  getCultureName(cultureId: number): string {
    const culture = this.cultures.find(c => c.id === cultureId);
    return culture ? culture.nom : 'Culture inconnue';
  }

  openAddParcelleModal(): void {
    this.editMode = false;
    this.selectedParcelle = null;
    this.showModal = true;
  }

  editParcelle(parcelle: Parcelle): void {
    this.editMode = true;
    this.selectedParcelle = parcelle;
    this.showModal = true;
  }

  deleteParcelle(parcelle: Parcelle): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la parcelle "${parcelle.nom}" ?`)) {
      this.parcelleService.deleteParcelle(parcelle.id!).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de la parcelle');
        }
      });
    }
  }

  toggleParcelleStatus(parcelle: Parcelle): void {
    const request = parcelle.active
      ? this.parcelleService.desactiverParcelle(parcelle.id!)
      : this.parcelleService.activerParcelle(parcelle.id!);

    request.subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Erreur changement statut:', err);
        alert('Erreur lors du changement de statut');
      }
    });
  }

  viewParcelleDetails(parcelle: Parcelle): void {
    this.router.navigate(['/parcelles', parcelle.id]);
  }

  viewParcelleOnMap(parcelle: Parcelle): void {
    this.activeTab = 'map';
    // La sélection sera gérée par le composant map
  }

  onParcelleSelected(parcelle: Parcelle): void {
    this.viewParcelleDetails(parcelle);
  }

  onSaveParcelle(parcelle: Parcelle): void {
    this.closeModal();
    this.loadData();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedParcelle = null;
    this.editMode = false;
  }

  resetFilters(): void {
    this.currentFilters = null;
    this.filteredParcelles = [...this.parcelles];
    this.currentPage = 1;
    this.updatePagination();
    this.updateTabsCounts();
  }
}
