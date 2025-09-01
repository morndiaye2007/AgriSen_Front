import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService} from 'src/app/services/agent/agent.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit {
  displayedColumns: string[] = [
    'nomComplet',
    'matricule',
    // 'motdepasse',
    'email',
    'description',
    'age',
    'dateNaissance',
    'heure',
    'sexe',
    'notes',
    'preferences',
    'pays',
    'filiere',

    'telephone',
    'actions'
  ];
  
  agentToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  agents: any;
  dataSource: any = []; //  Initialisation avec un tableau vide
  loadingIndicator = true;
  
  data: any;

  constructor(
    private modalService: NgbModal,
    private agentServices: AgentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllAgents();
  }

  getAllAgents() {
    console.log('🔍 Paramètres de pagination:', this.pageOptions);
    
    this.loadingIndicator = true; //  S'assurer que le loading est activé
    
    this.agentServices.getAllAgents(this.pageOptions).subscribe({
      next: response => {
        console.log(' Response reçue:', response);
        console.log(' Type de response:', typeof response);
        console.log(' Est-ce un tableau?', Array.isArray(response));
        
        //  Gestion flexible de la structure des données
        if (response) {
          // Si c'est une réponse avec payload (votre API)
          if (response.payload && Array.isArray(response.payload)) {
            this.dataSource = response;
            console.log(' Réponse avec payload détectée');
          }
          // Si c'est une réponse paginée (ex: Spring Boot)
          else if (response.content && Array.isArray(response.content)) {
            this.dataSource = response.content;
            console.log(' Données paginées détectées');
          }
          // Si c'est directement un tableau
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
        console.log(' Nombre d\'agents:', this.dataSource?.length || 0);
        
        this.loadingIndicator = false;
      },
      error: err => {
        console.error(' Erreur lors de la récupération des agents:', err);
        console.error(' Détails de l\'erreur:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        
        this.dataSource = [];
        this.loadingIndicator = false;
        
        //  Afficher une alerte d'erreur
        Alertes.alerteAddDanger('Erreur lors du chargement des agents');
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
      this.getAllAgents();
    } else {
      console.warn(' Événement de pagination invalide:', $event);
    }
  }

  openAddAgent(content: TemplateRef<any>) {
    this.openModal(content, 'lg');
  }

  openEditAgent(content: TemplateRef<any>, agent: any) {
    this.agentToUpdate = agent;
    console.log(" Agent à modifier:", this.agentToUpdate);
    this.openModal(content, 'lg');
  }

  DeleteAgent(agent: any) {
    if (!agent) {
      console.warn(' Aucun agent sélectionné pour suppression');
      return;
    }
    
    Alertes.confirmAction("Voulez-vous supprimer ?", "Cet agent sera supprimé", () => {
      this.deleteAgent(agent);
    });
  }

  openModal(content: TemplateRef<any>, size: any) {
    this.modalService.open(content, {size: size, backdrop: 'static'}).result.then((result) => {
      console.log(' Modal fermée avec résultat:', result);
    }).catch((res) => {
      console.log(' Modal fermée sans résultat:', res);
    });
  }

  deleteAgent(agent: any) {
    Alertes.confirmAction( 
      'Voulez-vous supprimer ?',
      'Cet élément sera définitivement supprimé',
      () => {
        this.agentServices.deleteAgent(agent).subscribe({
          next: (value) => {
            console.log(' Agent supprimé:', value);
            Alertes.alerteAddSuccess('Suppression réussie');
          },
          error: (value) => {
            console.error(' Erreur suppression:', value);
            Alertes.alerteAddDanger(value.error?.message || 'Erreur lors de la suppression');
          },
          complete: () => {
            this.getAllAgents();
          },
        });
      }
    );
  }

  close() {
    this.modalService.dismissAll();
    this.getAllAgents();
  }

  doSearch(data: any) {
    console.log(' Recherche avec filtres:', data);
    
    this.pageOptions = { ...data }; //  Copie de l'objet au lieu d'assignation directe
    this.pageOptions.page = 0;
    this.pageOptions.size = 20;
    
    console.log(" Paramètres de filtrage:", this.pageOptions);
    this.getAllAgents();
    this.modalService.dismissAll();
  }

  //  Méthode trackBy pour optimiser le rendu de la liste
  trackByAgent(index: number, agent: any): any {
    return agent.id || agent.matricule || index;
  }

  getPreferences(preferences:any[]){
    if (preferences.length>0){
      let preferencesDescription = '';
      preferences.forEach(preference =>{
        preferencesDescription += preference.description + ', ';
      })
      return preferencesDescription.slice(0, -2)
    }else{return ''}
  }

}