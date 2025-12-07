import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Parcelle } from '../../../core/models/parcelle.model';
import { ParcellesService } from '../../../core/services/parcelles.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parcelles-list',
  templateUrl: './parcelles-list.component.html',
  styleUrls: ['./parcelles-list.component.scss']
})
export class ParcellesListComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'taille', 'region', 'cultureActuelle', 'actions'];
  dataSource = new MatTableDataSource<Parcelle>([]);
  searchTerm = '';
  selectedFilter = 'toutes';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private parcellesService: ParcellesService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadParcelles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadParcelles(): void {
    this.parcellesService.getAll().subscribe({
      next: (parcelles) => {
        this.dataSource.data = parcelles;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des parcelles', 'Erreur');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByCulture(culture: string): void {
    this.selectedFilter = culture;
    if (culture === 'toutes') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = culture.toLowerCase();
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/parcelles', id]);
  }

  editParcelle(id: string): void {
    this.router.navigate(['/dashboard/parcelles', id, 'edit']);
  }

  deleteParcelle(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer la parcelle',
        message: 'Êtes-vous sûr de vouloir supprimer cette parcelle ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.parcellesService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Parcelle supprimée avec succès', 'Succès');
            this.loadParcelles();
          },
          error: () => {
            this.toastr.error('Erreur lors de la suppression', 'Erreur');
          }
        });
      }
    });
  }

  addParcelle(): void {
    this.router.navigate(['/dashboard/parcelles/new']);
  }
}

