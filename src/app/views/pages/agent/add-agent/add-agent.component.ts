import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from 'src/app/services/agent/agent.service';
import { PaysService } from 'src/app/services/pays/pays.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'] 
})
export class AddAgentComponent {
applyFilter() {
      if (this.dataSource) {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
        
        // Si nous sommes sur une page autre que la première et qu'il n'y a pas de résultats après filtrage
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    }
  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() agentToUpdate: any;
  @Input() isSearch: any;
  libellePays: string = '';

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  listePays: any[] = [];
  listeFilieres: any[] = [];
searchTerm: String = '';
  // Variables de pagination pour les pays
  paysPageOptions: any = { page: 0, size: 10 };
  paysTotalItems: number = 0;
  paysLoading: boolean = false;
   dataSource: any = [];
  pageOptions: any = { page: 0, size: 10 };
 loadingIndicator = true;
  // Variables de pagination pour les filières
  filierePageOptions: any = { page: 0, size: 10 };
  filiereTotalItems: number = 0;
  filiereLoading: boolean = false;

  // Requêtes de recherche pour les modals
  paysCodeQuery: string = '';
  paysLibelleQuery: string = '';
  filiereCodeQuery: string = '';
  filiereLibelleQuery: string = '';

  dateMin!: string;
  dateMax!: string;
  agents: any[] = [];
  filieres: any[] = [];
  filePreview: string | null = null;
  selectedFileName: string = '';
  isImage: boolean = false;
  isPdf: boolean = false;
  isDoc: boolean = false;
  logoBase64: string | null = null;
  allAgents: any[] = [];
  selectedPaysLabel: string = '';
  postes: any[] = [];
  departements: any[] = [];
  langues: any[] = [];
  selectedFile: File | null = null;

  sexe = [
    { name: 'MASCULIN', description: 'Masculin' },
    { name: 'FEMININ', description: 'Feminin' },
  ];

  preferences = [
    { name: 'SPORT', description: 'Sport' },
    { name: 'CUISINE', description: 'Cuisine' },
    { name: 'LECTURE', description: 'Lecture' },
  ];

  contrat = [
    { name: 'CDD', description: 'Contrat à durée déterminée' },
    { name: 'CDI', description: 'Contrat à durée indéterminée' },
    { name: 'STAGE', description: 'Stage professionnel' },
  ];

  competences = [
    { name: 'HTML', description: 'Langage de structuration des pages web' },
    { name: 'CSS', description: 'Langage de style pour la mise en forme des pages web' },
    { name: 'JAVASCRIPT', description: 'Langage de programmation pour rendre les pages web interactives' },
    { name: 'SQL', description: 'Langage de requêtes pour les bases de données' },
    { name: 'PYTHON', description: 'Langage polyvalent pour le développement web, IA et data science' }
  ];

  

  // Variables pour la gestion du modal pays
  selectedPaysIds: number[] = [];
  @ViewChild('paysModal') paysModal!: TemplateRef<any>;

  // Variables pour la gestion du modal filières
  selectedFiliereIds: number[] = [];
  @ViewChild('filiereModal') filiereModal!: TemplateRef<any>;

  constructor(
    private agentService: AgentService,
    private paysService: PaysService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sexe: this.fb.array([]),
      pays: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartements();
    this.loadPostes();
    this.loadLangues();
    this.loadPays();
    this.loadFilieres();
  }

  // Vérifier si le matricule existe déjà
  checkMatriculeExists(matricule: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.agentService.getAllAgents({ matricule: matricule }).subscribe({
        next: (response) => {
          const exists = response && response.payload && response.payload.length > 0;
          this.form.get('matriculeExists')?.setValue(exists);
          resolve(exists);
        },
        error: (error) => {
          console.error('Erreur lors de la vérification du matricule:', error);
          resolve(false);
        }
      });
    });
  }

  // Méthodes pour la pagination des pays
previousPaysPage(): void {
  if (this.paysPageOptions.page > 0) {
    this.paysPageOptions.page--;
    this.loadPays();
  }
}

nextPaysPage(): void {
  if ((this.paysPageOptions.page + 1) * this.paysPageOptions.size < this.paysTotalItems) {
    this.paysPageOptions.page++;
    this.loadPays();
  }
}

goToPaysPage(page: number): void {
  this.paysPageOptions.page = page - 1;
  this.loadPays();
}

// Méthodes pour la pagination des filières
previousFilierePage(): void {
  if (this.filierePageOptions.page > 0) {
    this.filierePageOptions.page--;
    this.loadFilieres();
  }
}

nextFilierePage(): void {
  if ((this.filierePageOptions.page + 1) * this.filierePageOptions.size < this.filiereTotalItems) {
    this.filierePageOptions.page++;
    this.loadFilieres();
  }
}

goToFilierePage(page: number): void {
  this.filierePageOptions.page = page - 1;
  this.loadFilieres();
}
  
  getAllFiliere() {
    console.log('🔍 Paramètres de pagination:', this.pageOptions);
    
    this.loadingIndicator = true; //  S'assurer que le loading est activé
    
    this.agentService.getAllFilere(this.pageOptions).subscribe({
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
      this.agentService.getAllFilere();
    } else {
      console.warn(' Événement de pagination invalide:', $event);
    }
  }

  

  // Méthode utilitaire pour générer les numéros de page
  // getPages(totalItems: number, pageSize: number, currentPage: number): number[] {
  //   const totalPages = Math.ceil(totalItems / pageSize);
  //   const pages: number[] = [];

  //   currentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  //   // Afficher maximum 5 pages autour de la page courante
  //   let startPage = Math.max(1, currentPage - 2);
  //   let endPage = Math.min(totalPages, startPage + 4);

  //   // Ajuster si on est près de la fin
  //   if (endPage - startPage < 4) {
  //     startPage = Math.max(1, endPage - 4);
  //   }

  //   for (let i = startPage; i <= endPage; i++) {
  //     pages.push(i);
  //   }

  //   return pages;
  // }
  

  initForm() {
    this.form = new FormGroup({
      nomComplet: new FormControl("", Validators.required),
      matricule: new FormControl("", Validators.required),
      matriculeExists: new FormControl(false),
      motdepasse: new FormControl(""),
      email: new FormControl("", Validators.required),
      description: new FormControl(""),
      age: new FormControl(""),
      dateNaissance: new FormControl("", Validators.required),
      heure: new FormControl("", Validators.required),
      sexe: new FormControl(""),
      preferences: new FormArray([]),
      pays: new FormControl({ value: '', disabled: true }),
      paysId: new FormControl(null),
      filiereSuivi: new FormControl({ value: '', disabled: true }),
      filiereIds: new FormControl([]),
      // multi-select search controls
      posteIds: new FormControl([]),
      typeContrats: new FormControl([]),
      telephone: new FormControl("", Validators.required),
      postes: new FormControl([], Validators.required),
      langues: new FormControl("", Validators.required),
      departements: new FormControl("", Validators.required),
      contrat: new FormControl([], Validators.required),
      competences: new FormControl([], Validators.required),
      notes: new FormControl("", Validators.required),
      notesMin: new FormControl(""),
      notesMax: new FormControl(""),
      notesEqual: new FormControl(""),
      ageMin: new FormControl(""),
      ageMax: new FormControl(""),
      ageEqual: new FormControl(""),
      dateMin: new FormControl(""),
      dateMax: new FormControl(""),
      filieres: new FormControl(""),
      // Opérateurs et valeurs pour l'heure
      heureOperator: new FormControl("eq"),
      heureValue: new FormControl(""),
      heureStart: new FormControl(""),
      heureEnd: new FormControl(""),
      filiereId: new FormControl(null),
      // Opérateurs et valeurs pour les notes
      notesOperator: new FormControl("eq"),
      notesValue: new FormControl(""),
      // Opérateurs et valeurs pour l'âge
      ageOperator: new FormControl("eq"),
      ageValue: new FormControl(""),
      // Opérateurs et valeurs pour la date
      dateOperator: new FormControl("eq"),
      dateValue: new FormControl(""),
      dateStart: new FormControl(""),
      dateEnd: new FormControl(""),
    });
  }

  // Méthode pour charger les pays avec pagination
  loadPays() {
    this.paysLoading = true;

    const req: any = { ...this.paysPageOptions };
    if (this.paysCodeQuery && this.paysCodeQuery.trim()) {
      req.code = this.paysCodeQuery.trim();
    }
    if (this.paysLibelleQuery && this.paysLibelleQuery.trim()) {
      req.libelle = this.paysLibelleQuery.trim();
    }
    
    this.agentService.getAllPaysPaginated(req).subscribe({
      next: (response) => {
        console.log('Réponse pays paginés:', response);
        
        // Adapter cette partie selon la structure de votre réponse API
        if (response && response.payload) {
          this.listePays = response.payload.content || response.payload;
          this.paysTotalItems = response.payload.totalElements || response.payload.length || 0;
        } else if (response && response.content) {
          this.listePays = response.content;
          this.paysTotalItems = response.totalElements || 0;
        } else if (Array.isArray(response)) {
          this.listePays = response;
          this.paysTotalItems = response.length;
        } else {
          console.warn("Structure de réponse inattendue:", response);
          this.listePays = [];
          this.paysTotalItems = 0;
        }
        
        this.paysLoading = false;
        console.log("Pays chargés => ", this.listePays.length, "sur", this.paysTotalItems);
      },
      error: (err) => {
        console.log('API pays non disponible, utilisation des données statiques');
        // Fallback avec des données statiques
        this.listePays = [
          { id: 1, code: 'SN', libelle: 'Sénégal' },
          { id: 2, code: 'FR', libelle: 'France' },
          { id: 3, code: 'US', libelle: 'États-Unis' }
        ];
        this.paysTotalItems = this.listePays.length;
        this.paysLoading = false;
      }
    });
  }

  loadPostes(): void {
    this.agentService.getAllPoste().subscribe({
      next: (data) => {
        this.postes = data;
        console.log("Postes => ", this.postes);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des postes', err);
      }
    });
  }

  loadLangues(): void {
    this.agentService.getAllLangues().subscribe({
      next: (data) => {
        this.langues = data;
        console.log("Langues => ", this.langues);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des langues', err);
      }
    });
  }

  loadDepartements(): void {
    this.agentService.getAllDepartement().subscribe({
      next: (data) => {
        this.departements = data;
        console.log("Départements => ", this.departements);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des départements', err);
      }
    });
  }

//   getAllFiliere() {
//   this.agentService.getAllFilere().subscribe({
//     next: (data) => {
//       this.filieres = data;
//     },
//     error: (err) => {
//       console.error('Erreur lors du chargement des filières', err);
//     }
//   });
// }


  // Méthode pour charger les filières avec pagination
  loadFilieres() {
    this.filiereLoading = true;

    const req: any = { ...this.filierePageOptions };
    if (this.filiereCodeQuery && this.filiereCodeQuery.trim()) {
      req.code = this.filiereCodeQuery.trim();
    }
    if (this.filiereLibelleQuery && this.filiereLibelleQuery.trim()) {
      req.libelle = this.filiereLibelleQuery.trim();
    }
    
    this.agentService.getAllFilerePaginated(req).subscribe({
      next: (response) => {
        console.log('Réponse filières paginées:', response);
        
        // Adapter cette partie selon la structure de votre réponse API
        if (response && response.payload) {
          this.listeFilieres = response.payload.content || response.payload;
          this.filiereTotalItems = response.payload.totalElements || response.payload.length || 0;
        } else if (response && response.content) {
          this.listeFilieres = response.content;
          this.filiereTotalItems = response.totalElements || 0;
        } else if (Array.isArray(response)) {
          this.listeFilieres = response;
          this.filiereTotalItems = response.length;
        } else {
          console.warn("Structure de réponse inattendue:", response);
          this.listeFilieres = [];
          this.filiereTotalItems = 0;
        }
        
        this.filiereLoading = false;
        console.log("Filieres chargées => ", this.listeFilieres.length, "sur", this.filiereTotalItems);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filieres', err);
        // Fallback avec des données statiques
        this.listeFilieres = [
          { id: 1, code: 'INFO', libelle: 'Informatique' },
          { id: 2, code: 'MATH', libelle: 'Mathématiques' },
          { id: 3, code: 'PHYS', libelle: 'Physique' }
        ];
        this.filiereTotalItems = this.listeFilieres.length;
        this.filiereLoading = false;
      }
    });
  }

  // Pagination pour les pays
paginatePays(page: number) {
  console.log('Pagination pays demandée:', page);
  
  // Validation de l'événement de pagination
  if (page !== undefined && page !== null) {
    this.paysLoading = true;
    
    // Si page est un numéro de page (commençant à 1), convertir en index (commençant à 0)
    const pageIndex = page >= 1 ? page - 1 : page;
    
    // Vérifier que la page est dans les limites
    const totalPages = Math.ceil(this.paysTotalItems / this.paysPageOptions.size);
    if (pageIndex >= 0 && pageIndex < totalPages) {
      this.paysPageOptions.page = pageIndex;
      this.loadPays();
    } else {
      console.warn('Page hors limites:', pageIndex);
      this.paysLoading = false;
    }
  } else {
    console.warn('Événement de pagination invalide pour les pays:', page);
  }
}

// Pagination pour les filières
paginateFilieres(page: number) {
  console.log('Pagination filières demandée:', page);
  
  // Validation de l'événement de pagination
  if (page !== undefined && page !== null) {
    this.filiereLoading = true;
    
    // Si page est un numéro de page (commençant à 1), convertir en index (commençant à 0)
    const pageIndex = page >= 1 ? page - 1 : page;
    
    // Vérifier que la page est dans les limites
    const totalPages = Math.ceil(this.filiereTotalItems / this.filierePageOptions.size);
    if (pageIndex >= 0 && pageIndex < totalPages) {
      this.filierePageOptions.page = pageIndex;
      this.loadFilieres();
    } else {
      console.warn('Page hors limites:', pageIndex);
      this.filiereLoading = false;
    }
  } else {
    console.warn('Événement de pagination invalide pour les filières:', page);
  }
}

  create() {
    let agent = this.form.value;
    agent.pays = undefined;
    // Inclure l'ID de la filière sélectionnée
    agent.filiereSuivi = { id: this.form.get('filiereId')?.value };
    console.log('Agent', agent);
    this.agentService.createAgent(agent).subscribe({
      next: (data) => {
        Alertes.alerteAddSuccess('Enregistrement reussi');
        this.emitSubmit();
      },
      error: (error) => {
        Alertes.alerteAddDanger(error.error.message);
      },
      complete: () => {
        this.close();
      }
    });
  }

  close() {
    this.modalService.dismissAll();
  }
  
  doSearch() {
    console.log('🔍 Valeurs du formulaire de recherche:', this.form.value);
    
    const searchData: any = {};
    const formValue = this.form.value;

    // Ajouter les filières sélectionnées (mode recherche)
    if (formValue.filiereIds && formValue.filiereIds.length > 0) {
      searchData.filiereIds = formValue.filiereIds.join(',');
    }
    
    // Ajouter les autres champs de recherche
    Object.keys(formValue).forEach(key => {
      const excludedFields = [
        'notesOperator', 'notesValue', 'notesMin', 'notesMax',
        'ageOperator', 'ageValue', 'ageMin', 'ageMax',
        'dateOperator', 'dateValue', 'dateStart', 'dateEnd',
        'dateMin', 'dateMax', 'notesEqual', 'ageEqual',
        'filiereSuivi'
      ];
      
      if (!excludedFields.includes(key) && 
          formValue[key] !== '' && 
          formValue[key] !== null && 
          formValue[key] !== undefined) {
        if (Array.isArray(formValue[key]) && (key === 'posteIds' || key === 'typeContrats')) {
          searchData[key] = formValue[key].join(',');
        } else {
          searchData[key] = formValue[key];
        }
      }
    });
    
    // Traiter les notes selon l'opérateur sélectionné
    if (formValue.notesOperator) {
      switch(formValue.notesOperator) {
        case 'eq':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notes = String(formValue.notesValue);
          }
          break;
        case 'gt':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notesGt = String(formValue.notesValue);
          }
          break;
        case 'gte':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notesMin = String(formValue.notesValue);
          }
          break;
        case 'lt':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notesLt = String(formValue.notesValue);
          }
          break;
        case 'lte':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notesMax = String(formValue.notesValue);
          }
          break;
        case 'ne':
          if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
            searchData.notesNotEqual = String(formValue.notesValue);
          }
          break;
        case 'between':
          if (formValue.notesMin !== '' && formValue.notesMin !== null && formValue.notesMin !== undefined &&
              formValue.notesMax !== '' && formValue.notesMax !== null && formValue.notesMax !== undefined) {
            searchData.notesMin = String(formValue.notesMin);
            searchData.notesMax = String(formValue.notesMax);
          }
          break;
      }
    }
    
    // Traiter l'âge selon l'opérateur sélectionné
    if (formValue.ageOperator) {
      switch(formValue.ageOperator) {
        case 'eq':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageEqual = String(formValue.ageValue);
          }
          break;
        case 'gt':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageGt = String(formValue.ageValue);
          }
          break;
        case 'gte':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageMin = String(formValue.ageValue);
          }
          break;
        case 'lt':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageLt = String(formValue.ageValue);
          }
          break;
        case 'lte':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageMax = String(formValue.ageValue);
          }
          break;
        case 'ne':
          if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
            searchData.ageNotEqual = String(formValue.ageValue);
          }
          break;
        case 'between':
          if (formValue.ageMin !== '' && formValue.ageMin !== null && formValue.ageMin !== undefined &&
              formValue.ageMax !== '' && formValue.ageMax !== null && formValue.ageMax !== undefined) {
            searchData.ageMin = String(formValue.ageMin);
            searchData.ageMax = String(formValue.ageMax);
            }
            break;
        }
      }
      
      // Traiter la date selon l'opérateur sélectionné
      if (formValue.dateOperator) {
        switch(formValue.dateOperator) {
          case 'eq':
            if (formValue.dateValue) {
              searchData.dateNaissanceEqual = formValue.dateValue;
            }
            break;
          case 'gt':
            if (formValue.dateValue) {
              searchData.dateGt = formValue.dateValue;
            }
            break;
          case 'gte':
            if (formValue.dateValue) {
              searchData.dateMin = formValue.dateValue;
            }
            break;
          case 'lt':
            if (formValue.dateValue) {
              searchData.dateLt = formValue.dateValue;
            }
            break;
          case 'lte':
            if (formValue.dateValue) {
              searchData.dateMax = formValue.dateValue;
            }
            break;
          case 'ne':
            if (formValue.dateValue) {
              searchData.dateNaissanceNotEqual = formValue.dateValue;
            }
            break;
          case 'between':
            if (formValue.dateStart && formValue.dateEnd) {
              searchData.dateMin = formValue.dateStart;
              searchData.dateMax = formValue.dateEnd;
            }
            break;
        }
      }
  
      // Traiter l'heure selon l'opérateur sélectionné
      if (formValue.heureOperator) {
        switch(formValue.heureOperator) {
          case 'eq':
            if (formValue.heureValue) {
              searchData.heureEqual = formValue.heureValue;
            }
            break;
          case 'gt':
            if (formValue.heureValue) {
              searchData.heureGt = formValue.heureValue;
            }
            break;
          case 'gte':
            if (formValue.heureValue) {
              searchData.heureMin = formValue.heureValue;
            }
            break;
          case 'lt':
            if (formValue.heureValue) {
              searchData.heureLt = formValue.heureValue;
            }
            break;
          case 'lte':
            if (formValue.heureValue) {
              searchData.heureMax = formValue.heureValue;
            }
            break;
          case 'ne':
            if (formValue.heureValue) {
              searchData.heureNotEqual = formValue.heureValue;
            }
            break;
          case 'between':
            if (formValue.heureStart && formValue.heureEnd) {
              searchData.heureMin = formValue.heureStart;
              searchData.heureMax = formValue.heureEnd;
            }
            break;
        }
      }
      
      // Ajouter les autres champs de recherche
      Object.keys(formValue).forEach(key => {
        const excludedFields = [
          'notesOperator', 'notesValue', 'notesMin', 'notesMax',
          'ageOperator', 'ageValue', 'ageMin', 'ageMax',
          'dateOperator', 'dateValue', 'dateStart', 'dateEnd',
          'dateMin', 'dateMax', 'notesEqual', 'ageEqual'
        ];
        
        if (!excludedFields.includes(key) && 
            formValue[key] !== '' && 
            formValue[key] !== null && 
            formValue[key] !== undefined) {
          
          if (Array.isArray(formValue[key]) && (key === 'posteIds' || key === 'typeContrats')) {
            searchData[key] = formValue[key].join(',');
          } else if (key.includes('age') || key.includes('notes') || key === 'matricule') {
            searchData[key] = String(formValue[key]);
          } else {
            searchData[key] = formValue[key];
          }
        }
      });
      
      console.log('🔍 Données de recherche finales:', searchData);
      this.search.emit(searchData);
    }
  
    // Fonction pour gérer les checkbox
    onSexeChange(event: any) {
      const sexeArray: FormArray = this.form.get('sexe') as FormArray;
  
      if (event.target.checked) {
        sexeArray.push(this.fb.control(event.target.value));
      } else {
        const index = sexeArray.controls.findIndex(x => x.value === event.target.value);
        sexeArray.removeAt(index);
      }
    }
  
    searchByDate() {
      this.agents = this.allAgents.filter(agent => {
        const agentDate = new Date(agent.dateNaissance);
        const minDate = this.dateMin ? new Date(this.dateMin) : null;
        const maxDate = this.dateMax ? new Date(this.dateMax) : null;
    
        if (minDate && maxDate) {
          return agentDate >= minDate && agentDate <= maxDate;
        } else if (minDate) {
          return agentDate >= minDate;
        } else if (maxDate) {
          return agentDate <= maxDate;
        } else {
          return true;
        }
      });
    }
    
    emitSubmit() {
      this.submit.emit(true);
    }
  
    openModal(content: TemplateRef<any>, size: any) {
      this.modalService.open(content, { size: size, backdrop: 'static' }).result.then((result) => {
        console.log(' Modal fermée avec résultat:', result);
      }).catch((res) => {
        console.log(' Modal fermée sans résultat:', res);
      });
    }
  
    // Ouvrir le modal de sélection des pays
    openPaysModal() {  
      if (this.isSearch) {
        this.selectedPaysIds = this.form.get('paysId')?.value || [];
      } else {
        this.selectedPaysIds = this.form.get('paysId')?.value ? [this.form.get('paysId')?.value] : [];
      }
  
      // Réinitialiser la pagination
      this.paysPageOptions = { page: 0, size: 10 };
      this.loadPays();
  
      const modalRef = this.modalService.open(this.paysModal, {
        size: 'lg',
        backdrop: 'static'
      });
    }
  
    // Gestion de la sélection pays dans le modal
    onPaysSelectionChange(pays: any, event: any) {
      if (this.isSearch) {
        if (event.target.checked) {
          if (!this.selectedPaysIds.includes(pays.id)) {
            this.selectedPaysIds.push(pays.id);
          }
        } else {
          this.selectedPaysIds = this.selectedPaysIds.filter(id => id !== pays.id);
        }
      } else {
        this.selectedPaysIds = [pays.id];
      }
    }
  
    // Gestion du clic sur une ligne du tableau
    onPaysRowClick(pays: any) {
      if (this.isSearch) {
        if (this.selectedPaysIds.includes(pays.id)) {
          this.selectedPaysIds = this.selectedPaysIds.filter(id => id !== pays.id);
        } else {
          this.selectedPaysIds.push(pays.id);
        }
      } else {
        this.selectedPaysIds = [pays.id];
      }
    }
  
    // Vérifier si un pays est sélectionné
    isPaysSelected(paysId: number): boolean {
      return this.selectedPaysIds.includes(paysId);
    }
  
    // Vérifier si la sélection est valide
    hasValidSelection(): boolean {
      return this.selectedPaysIds.length > 0;
    }
  
    // Valider la sélection et fermer le modal
    validatePaysSelection(modal: any) {
      const selectedPays = this.listePays.filter(p => this.selectedPaysIds.includes(p.id));
      
      if (this.isSearch) {
        const paysLibelles = selectedPays.map(p => p.libelle).join(', ');
        this.form.get('pays')?.setValue(paysLibelles);
        this.form.get('paysId')?.setValue(this.selectedPaysIds);
      } else {
        if (selectedPays.length > 0) {
          this.form.get('pays')?.setValue(selectedPays[0].libelle);
          this.form.get('paysId')?.setValue(selectedPays[0].id);
        }
      }
      
      modal.close();
    }
  
    // Pagination pour les pays
  // paginatePays(page: number) {
  //   const totalPages = Math.max(1, Math.ceil(this.paysTotalItems / this.paysPageOptions.size));
  //   let targetIndex = page;
  //   if (page >= 1) {
  //     targetIndex = page - 1;
  //   }
  //   const clamped = Math.max(0, Math.min(targetIndex, totalPages - 1));
  //   this.paysPageOptions.page = clamped;
  //   this.loadPays();
  // }

  // Pagination pour les filières
  //paginateFilieres(page: number) {
  //   const totalPages = Math.max(1, Math.ceil(this.filiereTotalItems / this.filierePageOptions.size));
  //   let targetIndex = page;
  //   if (page >= 1) {
  //     targetIndex = page - 1;
  //   }
  //   const clamped = Math.max(0, Math.min(targetIndex, totalPages - 1));
  //   this.filierePageOptions.page = clamped;
  //   this.loadFilieres();
  // }

  // Recherche Pays
  onPaysSearch() {
    this.paysPageOptions.page = 0;
    this.loadPays();
  }

  // Recherche Filières
  onFiliereSearch() {
    this.filierePageOptions.page = 0;
    this.loadFilieres();
  }
 
   // Ouvrir le modal de sélection des filières
    openFiliereModal() {
      this.selectedFiliereIds = this.form.get('filiereIds')?.value || [];
  
      // Réinitialiser la pagination
      this.filierePageOptions = { page: 0, size: 10 };
      this.loadFilieres();
  
      const modalRef = this.modalService.open(this.filiereModal, {
        size: 'lg',
        backdrop: 'static'
      });
    }
  
    // Gestion de la sélection filières dans le modal
    onFiliereSelectionChange(filiere: any, event: any) {
      if (event.target.checked) {
        if (!this.selectedFiliereIds.includes(filiere.id)) {
          this.selectedFiliereIds.push(filiere.id);
        }
      } else {
        this.selectedFiliereIds = this.selectedFiliereIds.filter(id => id !== filiere.id);
      }
    }
  
    // Gestion du clic sur une ligne du tableau filières
    onFiliereRowClick(filiere: any) {
      if (this.selectedFiliereIds.includes(filiere.id)) {
        this.selectedFiliereIds = this.selectedFiliereIds.filter(id => id !== filiere.id);
      } else {
        this.selectedFiliereIds.push(filiere.id);
      }
    }
  
    // Vérifier si une filière est sélectionnée
    isFiliereSelected(filiereId: number): boolean {
      return this.selectedFiliereIds.includes(filiereId);
    }
  
    // Vérifier si la sélection filières est valide
    hasValidFiliereSelection(): boolean {
      return this.selectedFiliereIds.length > 0;
    }
  
    // Valider la sélection filières et fermer le modal
    validateFiliereSelection(modal: any) {
      const selectedFilieres = this.listeFilieres.filter(f => this.selectedFiliereIds.includes(f.id));
      
      const filiereLibelles = selectedFilieres.map(f => f.libelle).join(', ');
      this.form.get('filiereSuivi')?.setValue(filiereLibelles);
      this.form.get('filiereIds')?.setValue(this.selectedFiliereIds);
      
      modal.close();
    }
  
    onCheckboxChange(e: any) {
      const preferencesArray: FormArray = this.form.get('preferences') as FormArray;
  
      if (e.target.checked) {
        preferencesArray.push(new FormControl(e.target.value));
      } else {
        const index = preferencesArray.controls.findIndex(x => x.value === e.target.value);
        if (index !== -1) {
          preferencesArray.removeAt(index);
        }
      }
    }
  
    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      console.log("Fichier sélectionné :", this.selectedFile);
    }
  
    uploadFile() {
      if (!this.selectedFile) {
        console.warn("Aucun fichier sélectionné !");
        return;
      }
  
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
  
    onPaysChange(event: any) {
      const paysArray: FormArray = this.form.get('pays') as FormArray;
  
      if (event.target.checked) {
        paysArray.push(this.fb.control(event.target.value));
      } else {
        const index = paysArray.controls.findIndex(x => x.value === event.target.value);
        paysArray.removeAt(index);
      }
    }

    // Méthodes pour générer les numéros de page
getPaysPages(): number[] {
  return this.getPages(this.paysTotalItems, this.paysPageOptions.size, this.paysPageOptions.page + 1);
}

getFilierePages(): number[] {
  return this.getPages(this.filiereTotalItems, this.filierePageOptions.size, this.filierePageOptions.page + 1);
}

// Méthode utilitaire pour générer les numéros de page
getPages(totalItems: number, pageSize: number, currentPage: number): number[] {
  const totalPages = Math.ceil(totalItems / pageSize);
  const pages: number[] = [];

  // Ajuster la page courante si nécessaire
  currentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  // Afficher maximum 5 pages autour de la page courante
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Ajuster si on est près de la fin
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}


  }