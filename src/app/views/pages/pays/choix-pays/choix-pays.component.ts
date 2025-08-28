import { Component, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaysService } from 'src/app/services/pays/pays.service';
import { Alertes } from 'src/app/util/alerte';
import {SelectionModel} from '@angular/cdk/collections';



@Component({
  selector: 'app-choix-pays',
  templateUrl: './choix-pays.component.html',
  styleUrls: ['./choix-pays.component.scss']
})
export class ChoixPaysComponent {

  displayedColumns: string[] = [
      'select',
      'code',
      'libelle'
   ];
    
    paysToUpdate: any;
    pageOptions: any = { page: 0, size: 10 };
    dataSource: any = []; //  Initialisation avec un tableau vide
    loadingIndicator = true;
    selection = new SelectionModel<any>(false, []); //false = choix unique

    
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
      
      this.paysServices.getAllPays(this.pageOptions).subscribe({
        next: response => {
          this.dataSource = response.payload;
          console.log("data receive : ", this.dataSource);
          
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
  
    // openAddPays(content: TemplateRef<any>) {
    //   this.openModal(content, 'lg');
    // }
  
    // openEditPays(content: TemplateRef<any>, pays: any) {
    //   this.paysToUpdate = pays;
    //   console.log(" Pays à modifier:", this.paysToUpdate);
    //   this.openModal(content, 'lg');
    // }
  
    // DeletePays(pays: any) {
    //   if (!pays) {
    //     console.warn(' Aucun pays sélectionné pour suppression');
    //     return;
    //   }
      
    //   Alertes.confirmAction("Voulez-vous supprimer ?", "Ce pays sera supprimé", () => {
    //     this.deletePays(pays);
    //   });
    // }
  
//    openModal(content: TemplateRef<any>, size: any) {
//   this.modalRef = this.modalService.open(content, { size: size, backdrop: 'static' });
//   this.modalRef.result.then((result) => {
//     console.log('Modal fermée avec résultat:', result);
//     // Ici tu peux faire une action après validation
//   }).catch((res) => {
//     console.log('Modal fermée sans résultat:', res);
//   });
// }
  
    // deletePays(pays: any) {
    //   Alertes.confirmAction( 
    //     'Voulez-vous supprimer ?',
    //     'Cet élément sera définitivement supprimé',
    //     () => {
    //       this.paysServices.deletePays(pays).subscribe({
    //         next: (value) => {
    //           console.log(' Pays supprimé:', value);
    //           Alertes.alerteAddSuccess('Suppression réussie');
    //         },
    //         error: (value) => {
    //           console.error(' Erreur suppression:', value);
    //           Alertes.alerteAddDanger(value.error?.message || 'Erreur lors de la suppression');
    //         },
    //         complete: () => {
    //           this.getAllPays();
    //         },
    //       });
    //     }
    //   );
    // }
  
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

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
  this.activeModal.close(selected); // renvoie la sélection au parent
}
}
