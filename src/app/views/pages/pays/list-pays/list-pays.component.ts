import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaysService} from 'src/app/services/pays/pays.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-pays',
  templateUrl: './list-pays.component.html',
  styleUrls: ['./list-pays.component.scss']
})
export class ListPaysComponent implements OnInit {
  displayedColumns: string[] = [
    'code',
    'libelle',
    'actions',
 ];
  
  paysToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  pays: any;
  dataSource: any = []; //  Initialisation avec un tableau vide
  loadingIndicator = true;
  
  data: any;

  constructor(
    private modalService: NgbModal,
    private paysServices: PaysService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllPays();
  }

  getAllPays() {
    console.log(' Paramètres de pagination:', this.pageOptions);
    
    this.loadingIndicator = true; //  S'assurer que le loading est activé
    
    this.paysServices.getAllPays(this.pageOptions).subscribe({
      next: response => {
        console.log(' Response reçue:', response);
        console.log(' Type de response:', typeof response);
        console.log(' Est-ce un tableau?', Array.isArray(response));
        
        //  Gestion flexible de la structure des données
        if (response) {
          if (response.content && Array.isArray(response.content)) {
            this.dataSource = response.content;
            console.log(' Données paginées détectées');
          }
          else if (Array.isArray(response)) {
            this.dataSource = response;
            console.log(' Tableau direct détecté');
          }
          // Si c'est un objet avec une propriété data
          else if (response.data && Array.isArray(response.data)) {
            this.dataSource = response.data;
            console.log(' Propriété data détectée');
          }
          // Sinon, utiliser la réponse telle quelle
          else {
            this.dataSource = response;
            console.log(' Structure personnalisée');
          }
        } else {
          this.dataSource = [];
          console.warn(' Réponse vide ou nulle');
        }
        
        console.log(' DataSource final:', this.dataSource);
        console.log(' Nombre d\'pays:', this.dataSource?.length || 0);
        
        this.loadingIndicator = false;
      },
      error: err => {
        console.error(' Erreur lors de la récupération des pays:', err);
        console.error(' Détails de l\'erreur:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        
        this.dataSource = [];
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

  openAddPays(content: TemplateRef<any>) {
    this.openModal(content, 'lg');
  }

  openEditPays(content: TemplateRef<any>, pays: any) {
    this.paysToUpdate = pays;
    console.log("🔧 Pays à modifier:", this.paysToUpdate);
    this.openModal(content, 'lg');
  }

  DeletePays(pays: any) {
    if (!pays) {
      console.warn(' Aucun pays sélectionné pour suppression');
      return;
    }
    
    Alertes.confirmAction("Voulez-vous supprimer ?", "Ce pays sera supprimé", () => {
      this.deletePays(pays);
    });
  }

  openModal(content: TemplateRef<any>, size: any) {
    this.modalService.open(content, {size: size, backdrop: 'static'}).result.then((result) => {
      console.log(' Modal fermée avec résultat:', result);
    }).catch((res) => {
      console.log(' Modal fermée sans résultat:', res);
    });
  }

  deletePays(pays: any) {
    Alertes.confirmAction( 
      'Voulez-vous supprimer ?',
      'Cet élément sera définitivement supprimé',
      () => {
        this.paysServices.deletePays(pays).subscribe({
          next: (value) => {
            console.log(' Pays supprimé:', value);
            Alertes.alerteAddSuccess('Suppression réussie');
          },
          error: (value) => {
            console.error(' Erreur suppression:', value);
            Alertes.alerteAddDanger(value.error?.message || 'Erreur lors de la suppression');
          },
          complete: () => {
            this.getAllPays();
          },
        });
      }
    );
  }

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
}