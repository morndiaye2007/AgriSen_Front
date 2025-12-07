import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeCredit } from '../../../core/models/financement.model';
import { FinancementService } from '../../../core/services/financement.service';

@Component({
  selector: 'app-financement-list',
  templateUrl: './financement-list.component.html',
  styleUrls: ['./financement-list.component.scss']
})
export class FinancementListComponent implements OnInit {
  demandes: DemandeCredit[] = [];

  constructor(
    private financementService: FinancementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.financementService.getAll().subscribe({
      next: (demandes) => {
        this.demandes = demandes;
      }
    });
  }
}

