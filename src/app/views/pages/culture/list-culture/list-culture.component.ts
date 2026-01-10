import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CultureService } from '../../../../services/culture.service';
import { Culture } from '../../../../core/models/Culture';

@Component({
  selector: 'app-list-culture',
  templateUrl: './list-culture.component.html',
  styleUrls: ['./list-culture.component.scss']
})
export class ListCultureComponent implements OnInit {
  cultures: Culture[] = [];
  filteredCultures: Culture[] = [];
  loading = false;
  searchTerm = '';
  selectedCategorie = '';
  viewMode: 'grid' | 'list' = 'grid';

  categories: string[] = [];

  constructor(
    private cultureService: CultureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCultures();
  }

  loadCultures(): void {
    this.loading = true;
    this.cultureService.getAllCultures().subscribe({
      next: (data) => {
        this.cultures = data;
        this.filteredCultures = data;
        this.extractCategories();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cultures:', err);
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    const categoriesSet = new Set<string>();
    this.cultures.forEach(c => {
      if (c.categorie) {
        categoriesSet.add(c.categorie);
      }
    });
    this.categories = Array.from(categoriesSet).sort();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCultures = this.cultures.filter(c => {
      const matchesSearch = !this.searchTerm ||
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategorie = !this.selectedCategorie ||
        c.categorie === this.selectedCategorie;

      return matchesSearch && matchesCategorie;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategorie = '';
    this.filteredCultures = this.cultures;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  addCulture(): void {
    this.router.navigate(['/culture/add']);
  }

  viewDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/culture/detail', id]);
    }
  }

  editCulture(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/culture/edit', id]);
    }
  }

  deleteCulture(id: number | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) {
      this.cultureService.deleteCulture(id).subscribe({
        next: () => {
          this.loadCultures();
        },
        error: (err) => {
          console.error('Error deleting culture:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  getCultureIcon(categorie: string | undefined): string {
    const icons: any = {
      'Céréales': '🌾',
      'Légumineuses': '🫘',
      'Fruits': '🍎',
      'Légumes': '🥬',
      'Tubercules': '🥔',
      'Oléagineux': '🥜'
    };
    return icons[categorie || ''] || '🌱';
  }
}
