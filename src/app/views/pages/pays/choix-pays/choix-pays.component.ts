import { Component, TemplateRef, Input } from '@angular/core';
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

  @Input() isMultipleSelection: boolean = false; // Pour différencier ajout (false) et recherche (true)

  displayedColumns: string[] = [
      'select',
      'code',
      'libelle'
   ];
    
    paysToUpdate: any;
    pageOptions: any = { page: 0, size: 10 };
    dataSource: any = []; //  Initialisation avec un tableau vide
    loadingIndicator = true;
    selection = new SelectionModel<any>(true, []); // true = choix multiple pour recherche
    selectedPays: any = null; // Pour stocker le pays sélectionné avec radio button (ajout)

    
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
      
      this.loadingIndicator = true;
      
      // Charger directement depuis l'API
      this.paysServices.getAllPays(this.pageOptions).subscribe({
        next: response => {
          console.log("Réponse API complète:", response);
          
          // Gérer différentes structures de réponse
          if (response && response.payload) {
            this.dataSource = response.payload;
          } else if (Array.isArray(response)) {
            this.dataSource = response;
          } else if (response && response.data) {
            this.dataSource = response.data;
          } else if (response && response.content) {
            this.dataSource = response.content;
          } else {
            console.warn("Structure de réponse inattendue:", response);
            this.dataSource = [];
          }
          
          console.log("dataSource final:", this.dataSource);
          console.log("Nombre de pays:", this.dataSource?.length);
          
          // Si aucune donnée, utiliser fallback
          if (!this.dataSource || this.dataSource.length === 0) {
            console.log("Aucune donnée API, utilisation du fallback");
            this.dataSource = [
              { id: 1, code: 'SN', libelle: 'Sénégal' },
              { id: 2, code: 'FR', libelle: 'France' },
              { id: 3, code: 'US', libelle: 'États-Unis' },
              { id: 4, code: 'CA', libelle: 'Canada' },
              { id: 5, code: 'DE', libelle: 'Allemagne' }
            ];
          }
          
          this.loadingIndicator = false;
        },
        error: err => {
          console.error('Erreur API pays:', err);
          this.loadingIndicator = false;
          
          // Fallback en cas d'erreur
          this.dataSource = [
            { id: 1, code: 'SN', libelle: 'Sénégal' },
            { id: 2, code: 'FR', libelle: 'France' },
            { id: 3, code: 'US', libelle: 'États-Unis' },
            { id: 4, code: 'CA', libelle: 'Canada' },
            { id: 5, code: 'DE', libelle: 'Allemagne' }
          ];
          console.log("Utilisation des données de fallback");
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
  if (this.isMultipleSelection) {
    // Mode recherche : retourner tous les pays sélectionnés
    const selectedPays = this.selection.selected;
    if (selectedPays.length > 0) {
      this.activeModal.close(selectedPays);
    } else {
      console.warn("Aucun pays sélectionné");
      this.activeModal.dismiss("no-selection");
    }
  } else {
    // Mode ajout : retourner un seul pays
    if (this.selectedPays) {
      this.activeModal.close(this.selectedPays);
    } else {
      console.warn("Aucun pays sélectionné");
      this.activeModal.dismiss("no-selection");
    }
  }
}

onRadioChange(pays: any): void {
  this.selectedPays = pays;
  console.log("Pays sélectionné:", this.selectedPays);
}
}
