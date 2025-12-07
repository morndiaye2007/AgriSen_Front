import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalActivite, TypeActivite } from '../../../core/models/journal.model';
import { JournalService } from '../../../core/services/journal.service';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent implements OnInit {
  activites: JournalActivite[] = [];
  filteredActivites: JournalActivite[] = [];
  selectedType: string = 'tous';
  typesActivite = [
    { value: 'tous', label: 'Tous' },
    { value: TypeActivite.PLANTATION, label: 'Plantation' },
    { value: TypeActivite.IRRIGATION, label: 'Irrigation' },
    { value: TypeActivite.FERTILISATION, label: 'Fertilisation' },
    { value: TypeActivite.TRAITEMENT, label: 'Traitement' },
    { value: TypeActivite.RECOLTE, label: 'Récolte' }
  ];

  constructor(
    private router: Router,
    private journalService: JournalService
  ) {}

  ngOnInit(): void {
    this.loadActivites();
  }

  loadActivites(): void {
    this.journalService.getAll().subscribe({
      next: (activites) => {
        this.activites = activites;
        this.filteredActivites = activites;
      }
    });
  }

  filterByType(): void {
    if (this.selectedType === 'tous') {
      this.filteredActivites = this.activites;
    } else {
      this.filteredActivites = this.activites.filter(a => a.type === this.selectedType);
    }
  }

  addActivite(): void {
    this.router.navigate(['/dashboard/journal/new']);
  }
}

