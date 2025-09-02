import { Component, TemplateRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaysService } from 'src/app/services/pays/pays.service';
import { Alertes } from 'src/app/util/alerte';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';



@Component({
  selector: 'app-choix-pays',
  templateUrl: './choix-pays.component.html',
  styleUrls: ['./choix-pays.component.scss']
})
export class ChoixPaysComponent {
checkboxLabel(_t20: any): string {
throw new Error('Method not implemented.');
}

  displayedColumns: string[] = [
      'select',
      'code',
      'libelle'
   ];
    
    paysToUpdate: any;
    pageOptions: any = { page: 0, size: 10 };
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]); // Utilisation de MatTableDataSource
    loadingIndicator = true;
    selection = new SelectionModel<any>(false, []); //false = choix unique
    searchTerm: string = '';
    totalItems: number = 0;
    
    @ViewChild(MatSort) sort!: MatSort;

    
    data: any;
    modalRef!: NgbModalRef;
  
    constructor(
      private modalService: NgbModal,
      private paysServices: PaysService,
      public activeModal: NgbActiveModal     ) { }
  
    ngOnInit(): void {
      this.getAllPays();
    }
  
    getAllPays() {
      console.log(' Paramètres de pagination:', this.pageOptions);
      
      this.loadingIndicator = true; //  S'assurer que le loading est activé
      
      // Ajout du paramètre de tri si disponible
      let params = { ...this.pageOptions };
      if (this.sort && this.sort.active) {
        params['sort'] = this.sort.active;
        params['direction'] = this.sort.direction;
      }
      
      this.paysServices.getAllPays(params).subscribe({
        next: response => {
          // Mise à jour du dataSource avec les données reçues
          const data = response.payload || [];
          this.dataSource = new MatTableDataSource(data);
          
          // Configuration du tri et du filtre
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data: any, filter: string) => {
            return data.code?.toLowerCase().includes(filter.toLowerCase()) || 
                   data.libelle?.toLowerCase().includes(filter.toLowerCase());
          };
          
          // Mise à jour du nombre total d'éléments pour la pagination
          if (response.metadata) {
            this.totalItems = response.metadata.totalElements || 0;
          }
          
          console.log("data receive : ", this.dataSource.data);
          this.loadingIndicator = false;
        },
        error: err => {
          console.error(' Erreur lors de la récupération des pays:', err);
          this.loadingIndicator = false;
          
          //  Afficher une alerte d'erreur
          // Alertes.alerteAddDanger('Erreur lors du chargement des pays');
        },
        complete: () => {
          this.loadingIndicator = false;
          console.log(' Chargement terminé');
        }
      });
    }
  
    paginate($event: any) {
      console.log(' Pagination demandée:', $event);
      
      //  Validation de l'événement de pagination
      if ($event && typeof $event === 'number' && $event > 0) {
        this.loadingIndicator = true;
        this.pageOptions.page = $event - 1;
        this.getAllPays();
      } else {
        console.warn(' Événement de pagination invalide:', $event);
      }
    }
    
    // Méthode pour appliquer le filtre de recherche
    applyFilter() {
      if (this.dataSource) {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
        
        // Si nous sommes sur une page autre que la première et qu'il n'y a pas de résultats après filtrage
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    }
    
    // Méthode pour trier les données
    sortData(sort: Sort | any) {
      // Cast to Sort if it's an event object
      const sortEvent = sort as Sort;
      if (!sortEvent.active || sortEvent.direction === '') {
        return;
      }
      
      // Si nous utilisons le tri côté serveur
      this.pageOptions['sort'] = sortEvent.active;
      this.pageOptions['direction'] = sortEvent.direction;
      this.getAllPays();
    }
    
    // Suppression des méthodes dupliquées (lignes 133-141)
    // Les méthodes onValider et onFermer sont définies plus bas
  
    close() {
      this.modalService.dismissAll();
      this.getAllPays();
    }
  
    doSearch(data: any) {
      console.log(' Recherche avec filtres:', data);
      
      this.pageOptions = { ...data }; //  Copie de l'objet au lieu d'assignation directe
      this.pageOptions.page = 0;
      this.pageOptions.size = 20;
      
      console.log(" Paramètres de filtrage:", this.pageOptions);
      this.getAllPays();
      this.modalService.dismissAll();
    }
  
    //  Méthode trackBy pour optimiser le rendu de la liste
    trackByPays(index: number, pays: any): any {
      return pays.id || pays.matricule || index;
    }

    isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return ${this.isAllSelected() ? 'deselect' : 'select'} all;
  //   }
  //   return ${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1};
  // }

  // Méthodes uniques pour fermer et valider
  onFermer(): void {
    this.activeModal.dismiss(); // ferme sans retour
  }

  onValider(): void {
    const selected = this.selection.selected[0] ?? null;
    
    if (selected) {
      this.activeModal.close(selected);
    } else {
      console.warn("Aucun pays sélectionné");
      this.activeModal.dismiss("no-selection");
    }
  }
  
    }
