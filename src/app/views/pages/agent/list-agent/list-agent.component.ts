import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService} from 'src/app/services/agent/agent.service';
import { Alertes } from 'src/app/util/alerte';
import { MatSort, Sort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
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

  // Configuration des colonnes
  availableColumns: any[] = [
    { key: 'nomComplet', label: 'Nom Complet', visible: true, order: 0 },
    { key: 'matricule', label: 'Matricule', visible: true, order: 1 },
    { key: 'email', label: 'Courriel', visible: true, order: 2 },
    { key: 'description', label: 'Description', visible: true, order: 3 },
    { key: 'age', label: 'Âge', visible: true, order: 4 },
    { key: 'dateNaissance', label: 'Date de naissance', visible: true, order: 5 },
    { key: 'heure', label: 'Heure', visible: true, order: 6 },
    { key: 'sexe', label: 'Sexe', visible: true, order: 7 },
    { key: 'notes', label: 'Notes', visible: true, order: 8 },
    { key: 'preferences', label: 'Préférences', visible: true, order: 9 },
    { key: 'pays', label: 'Pays de résidence', visible: true, order: 10 },
    { key: 'filiere', label: 'Filière', visible: true, order: 11 },
    { key: 'telephone', label: 'Téléphone', visible: true, order: 12 },
    { key: 'actions', label: 'Actions', visible: true, order: 13, fixed: true }
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
    this.loadColumnConfiguration();
    this.getAllAgents();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe((s: Sort) => {
        const sortKeyMap: Record<string, string> = {
          nomComplet: 'nomComplet',
          matricule: 'matricule',
          email: 'email',
          description: 'description',
          age: 'age',
          dateNaissance: 'dateNaissance',
          heure: 'heure',
          sexe: 'sexe.description',
          notes: 'notes',
          pays: 'pays.libelle',
          filiere: 'filiere.libelle',
          telephone: 'telephone'
        };
        const mapped = sortKeyMap[s.active];
        if (!mapped) {
          // Colonnes non triables (ex: preferences, actions)
          return;
        }
        const direction = s.direction || 'asc';
        this.pageOptions = {
          ...this.pageOptions,
          sort: `${mapped},${direction}`
        };
        this.getAllAgents();
      });
    }
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

  onPageSizeChange() {
    console.log('🔄 Changement de taille de page:', this.pageOptions.size);
    this.pageOptions.page = 0; // Reset to first page
    this.getAllAgents();
  }

  // Gestion des colonnes
  @ViewChild('columnConfigModal') columnConfigModal!: TemplateRef<any>;

  openColumnConfig() {
    this.openModal(this.columnConfigModal, 'lg');
  }

  getVisibleColumns(): string[] {
    return this.availableColumns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order)
      .map(col => col.key);
  }

  getVisibleColumnConfig(): any[] {
    return this.availableColumns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }

  toggleColumnVisibility(column: any) {
    if (column.fixed) return; // Ne pas permettre de cacher les colonnes fixes
    column.visible = !column.visible;
  }

  trackByColumn(index: number, column: any): any {
    return column.key;
  }

  moveColumnUp(column: any) {
    const visibleColumns = this.getVisibleColumnConfig();
    const currentIndex = visibleColumns.findIndex(col => col.key === column.key);
    if (currentIndex > 0) {
      const previousColumn = visibleColumns[currentIndex - 1];
      const tempOrder = column.order;
      column.order = previousColumn.order;
      previousColumn.order = tempOrder;
    }
  }

  moveColumnDown(column: any) {
    const visibleColumns = this.getVisibleColumnConfig();
    const currentIndex = visibleColumns.findIndex(col => col.key === column.key);
    if (currentIndex < visibleColumns.length - 1) {
      const nextColumn = visibleColumns[currentIndex + 1];
      const tempOrder = column.order;
      column.order = nextColumn.order;
      nextColumn.order = tempOrder;
    }
  }

  isFirstVisibleColumn(column: any): boolean {
    const visibleColumns = this.getVisibleColumnConfig();
    return visibleColumns.length > 0 && visibleColumns[0].key === column.key;
  }

  isLastVisibleColumn(column: any): boolean {
    const visibleColumns = this.getVisibleColumnConfig();
    return visibleColumns.length > 0 && visibleColumns[visibleColumns.length - 1].key === column.key;
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    const visibleColumns = this.getVisibleColumnConfig();
    moveItemInArray(visibleColumns, event.previousIndex, event.currentIndex);
    
    // Réorganiser les ordres
    visibleColumns.forEach((col, index) => {
      col.order = index;
    });
  }

  selectAllColumns() {
    this.availableColumns.forEach(col => {
      if (!col.fixed) col.visible = true;
    });
  }

  deselectAllColumns() {
    this.availableColumns.forEach(col => {
      if (!col.fixed) col.visible = false;
    });
  }

  resetColumnsToDefault() {
    this.availableColumns.forEach((col, index) => {
      col.visible = true;
      col.order = index;
    });
  }

  saveColumnConfiguration(modal: any) {
    // Sauvegarder la configuration dans le localStorage
    const config = {
      columns: this.availableColumns.map(col => ({
        key: col.key,
        visible: col.visible,
        order: col.order
      }))
    };
    localStorage.setItem('agentListColumnConfig', JSON.stringify(config));
    modal.close();
    Alertes.alerteAddSuccess('Configuration des colonnes sauvegardée');
  }

  loadColumnConfiguration() {
    const savedConfig = localStorage.getItem('agentListColumnConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.columns) {
          config.columns.forEach((savedCol: any) => {
            const column = this.availableColumns.find(col => col.key === savedCol.key);
            if (column) {
              column.visible = savedCol.visible;
              column.order = savedCol.order;
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration des colonnes:', error);
      }
    }
  }

  getPreferences(preferences:any[]){
    if (preferences && preferences.length > 0){
      let preferencesDescription = '';
      preferences.forEach(preference =>{
        preferencesDescription += preference.description + ', ';
      })
      return preferencesDescription.slice(0, -2)
    }else{return ''}
  }

}