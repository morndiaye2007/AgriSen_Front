import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {Culture} from "../../../../core/models/Culture";

export interface ParcelleFilters {
  searchTerm: string;
  cultureId: number | null;
  typeSol: string;
  sourceEau: string;
  superficieMin: number | null;
  superficieMax: number | null;
  ville: string;
  showActive: boolean;
  showInactive: boolean;
}

@Component({
  selector: 'app-parcelle-filter',
  templateUrl: './parcelle-filter.component.html',
  styleUrls: ['./parcelle-filter.component.scss']
})
export class ParcelleFilterComponent implements OnInit {
  @Input() cultures: Culture[] = [];
  @Input() villes: string[] = [];
  @Input() filteredCount: number = 0;
  @Output() filtersChange = new EventEmitter<ParcelleFilters>();

  filters: ParcelleFilters = {
    searchTerm: '',
    cultureId: null,
    typeSol: '',
    sourceEau: '',
    superficieMin: null,
    superficieMax: null,
    ville: '',
    showActive: true,
    showInactive: true
  };

  ngOnInit(): void {
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.filtersChange.emit(this.filters);
  }

  resetFilters(): void {
    this.filters = {
      searchTerm: '',
      cultureId: null,
      typeSol: '',
      sourceEau: '',
      superficieMin: null,
      superficieMax: null,
      ville: '',
      showActive: true,
      showInactive: true
    };
    this.onFilterChange();
  }
}
