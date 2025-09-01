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

export class AddAgentComponent 
{
  form!:FormGroup
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() agentToUpdate:any;
  @Input() isSearch: any;
  libellePays : string='k';

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  listePays: any[] = [
    { id: 1, code: 'SN', libelle: 'Sénégal' },
    { id: 2, code: 'FR', libelle: 'France' },
    { id: 3, code: 'US', libelle: 'États-Unis' },
    { id: 4, code: 'CA', libelle: 'Canada' },
    { id: 5, code: 'DE', libelle: 'Allemagne' },
    { id: 6, code: 'IT', libelle: 'Italie' },
    { id: 7, code: 'ES', libelle: 'Espagne' },
    { id: 8, code: 'BR', libelle: 'Brésil' },
    { id: 9, code: 'JP', libelle: 'Japon' },
    { id: 10, code: 'ZA', libelle: 'Afrique du Sud' }
  ];

  dateMin!: string; // YYYY-MM-DD
dateMax!: string;
agents: any[] = []; // liste des agents
filieres: any[] = []; // liste des agents
// selectedFile: File | null = null;
  filePreview: string | null = null;
  selectedFileName: string = '';
  isImage: boolean = false;
  isPdf: boolean = false;
  isDoc: boolean = false;

  logoBase64: string | null = null;

allAgents: any[] = []; // liste complète pour filtrer côté front

selectedPaysLabel: string = '';

  postes: any[] = [];
  //formations: any[] = [];
    departements: any[] = [];
  langues: any[] = [];
  selectedFile: File | null = null;
  sexe=[
    {name:'MASCULIN',description:'Masculin'},
    {name:'FEMININ',description:'Feminin'},
  ]

  preferences=[
    {name:'SPORT',description:'Sport'},
    {name:'CUISINE',description:'Cuisine'},
    {name:'LECTURE',description:'Lecture'},
  ]

  contrat = [
  { name: 'CDD', description: 'Contrat à durée déterminée' },
  { name: 'CDI', description: 'Contrat à durée indéterminée' },
  { name: 'STAGE', description: 'Stage professionnel' },
]

competences = [
  { name: 'HTML', description: 'Langage de structuration des pages web' },
  { name: 'CSS', description: 'Langage de style pour la mise en forme des pages web' },
  { name: 'JAVASCRIPT', description: 'Langage de programmation pour rendre les pages web interactives' },
  { name: 'SQL', description: 'Langage de requêtes pour les bases de données' },
  { name: 'PYTHON', description: 'Langage polyvalent pour le développement web, IA et data science' }
]



  constructor(private agentService:AgentService, private paysService: PaysService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { 
     this.form = this.fb.group({
    sexe: this.fb.array([]), // tableau pour stocker les sexes choisis
    // ... autres champs
  });

   this.form = this.fb.group({
      pays: this.fb.array([]), // tableau pour les pays sélectionnés
      // ... autres champs
    });

   this.form = this.fb.group({
    pays: this.fb.array([]), // tableau pour stocker les pays choisis
    // ... autres champs
  });

  }
  ngOnInit(): void {
   this.initForm()
   this.loadDepartements()
  // this.loadFormations()
   this.loadPostes()
   this.loadLangues()
   this.loadPays();
   this.loadFilieres();
   }
  
  // Vérifier si le matricule existe déjà
  checkMatriculeExists(matricule: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Utiliser getAllAgents avec le matricule comme filtre pour vérifier l'existence
      this.agentService.getAllAgents({matricule: matricule}).subscribe({
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
  initForm(){
    this.form = new FormGroup(
      {
        nomComplet: new FormControl("", Validators.required),
        matricule: new FormControl("", Validators.required),
        matriculeExists: new FormControl(false),
        motdepasse: new FormControl(""),
        email: new FormControl("", Validators.required),
        description: new FormControl(""),
        age: new FormControl("",),
        dateNaissance: new FormControl("",Validators.required),
        heure: new FormControl("",Validators.required),
        sexe: new FormControl("",),
        preferences: new FormArray([]),
        pays: new FormControl({ value: '', disabled: true }),
        paysId: new FormControl(null),
        filiereSuivi: new FormControl({ value: '', disabled: true }),
        filiereIds: new FormControl([]),
        telephone: new FormControl("",Validators.required),
        postes: new FormControl("",Validators.required),
        langues: new FormControl("",Validators.required),
        departements: new FormControl("",Validators.required),
          contrat: new FormControl("", Validators.required),     
       competences: new FormControl([], Validators.required), 
       notes: new FormControl("",Validators.required),
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

      }
    );
   

  }

  loadPays() {
    // Utiliser des données statiques pour le moment
    this.listePays = [
      { id: 1, code: 'SN', libelle: 'Sénégal' },
      { id: 2, code: 'FR', libelle: 'France' },
      { id: 3, code: 'US', libelle: 'États-Unis' },
      { id: 4, code: 'CA', libelle: 'Canada' },
      { id: 5, code: 'DE', libelle: 'Allemagne' },
      { id: 6, code: 'IT', libelle: 'Italie' },
      { id: 7, code: 'ES', libelle: 'Espagne' },
      { id: 8, code: 'BR', libelle: 'Brésil' },
      { id: 9, code: 'JP', libelle: 'Japon' },
      { id: 10, code: 'ZA', libelle: 'Afrique du Sud' }
    ];
    console.log("Pays chargés (statiques) => ", this.listePays);
    
    // Optionnel : essayer de charger depuis l'API en parallèle
    this.paysService.getAllPays().subscribe({
      next: (response) => {
        const apiPays = response.payload || response;
        if (apiPays && apiPays.length > 0) {
          this.listePays = apiPays;
          console.log("Pays chargés depuis API => ", this.listePays);
        }
      },
      error: (err) => {
        console.log('API pays non disponible, utilisation des données statiques');
      }
    });
  }

  loadPostes(): void {
  this.agentService.getAllPoste().subscribe({
    next: (data) => {
      this.postes = data; // data est déjà le tableau
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


  // loadFormations(): void {
  //   this.agentService.getAllFormation().subscribe({
  //     next: (data) => {
  //       this.formations = data;
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du chargement des formations', err);
  //     }
  //   });
  // }


  create() {
    let agent = this.form.value;
    agent.pays =undefined
    console.log('Agent',agent);
    this.agentService.createAgent(agent).subscribe({
      next:(data) =>{
        Alertes.alerteAddSuccess('Enregistrement reussi');
        this.emitSubmit()
      },
      error:(error)=>{
        Alertes.alerteAddDanger(error.error.message)
      },
      complete:()=>{
        this.close()
      }
    })
  }

  close(){
    this.modalService.dismissAll();
  }
  
  doSearch(){
    console.log('🔍 Valeurs du formulaire de recherche:', this.form.value);
    console.log('🔍 Formulaire valide:', this.form.valid);
    console.log('🔍 Erreurs du formulaire:', this.form.errors);
    
    // Nettoyer les valeurs vides et convertir les types
   // Construire l'objet de recherche
  const searchData: any = {};
  
  // Récupérer les valeurs du formulaire
  const formValue = this.form.value;
  
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
          searchData.notesMin = String(formValue.notesValue);
        }
        break;
      case 'lt':
        if (formValue.notesValue !== '' && formValue.notesValue !== null && formValue.notesValue !== undefined) {
          searchData.notesMax = String(formValue.notesValue);
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
          searchData.ageMin = String(formValue.ageValue);
        }
        break;
      case 'lt':
        if (formValue.ageValue !== '' && formValue.ageValue !== null && formValue.ageValue !== undefined) {
          searchData.ageMax = String(formValue.ageValue);
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
          searchData.dateMin = formValue.dateValue;
        }
        break;
      case 'lt':
        if (formValue.dateValue) {
          searchData.dateMax = formValue.dateValue;
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
          searchData.heureMin = formValue.heureValue;
        }
        break;
      case 'lt':
        if (formValue.heureValue) {
          searchData.heureMax = formValue.heureValue;
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
  
  
  // Ajouter les autres champs de recherche (sauf les champs d'opérateurs)
  Object.keys(formValue).forEach(key => {
    // Liste des champs à exclure (opérateurs et valeurs temporaires)
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
      
      // Convertir les nombres en string pour l'API
      if (key.includes('age') || key.includes('notes') || key === 'matricule') {
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
      const agentDate = new Date(agent.dateNaissance); // ou agent.date selon ton modèle
      const minDate = this.dateMin ? new Date(this.dateMin) : null;
      const maxDate = this.dateMax ? new Date(this.dateMax) : null;
  
      if (minDate && maxDate) {
        return agentDate >= minDate && agentDate <= maxDate; // compris entre
      } else if (minDate) {
        return agentDate >= minDate; // supérieur à
      } else if (maxDate) {
        return agentDate <= maxDate; // inférieur à
      } else {
        return true; // aucun filtre
      }
    });
  }
  

  emitSubmit(){
    this.submit.emit(true);
  }

   openModal(content: TemplateRef<any>, size: any) {
      this.modalService.open(content, {size: size, backdrop: 'static'}).result.then((result) => {
        console.log(' Modal fermée avec résultat:', result);
      }).catch((res) => {
        console.log(' Modal fermée sans résultat:', res);
      });
    }

  // Variables pour la gestion du modal pays
  selectedPaysIds: number[] = [];
  @ViewChild('paysModal') paysModal!: TemplateRef<any>;

  // Variables pour la gestion du modal filières
  selectedFiliereIds: number[] = [];
  @ViewChild('filiereModal') filiereModal!: TemplateRef<any>;
  listeFilieres: any[] = [];

  // Ouvrir le modal de sélection des pays
  openPaysModal() {  
    // Initialiser la sélection temporaire avec les valeurs actuelles
    if (this.isSearch) {
      this.selectedPaysIds = this.form.get('paysId')?.value || [];
    } else {
      this.selectedPaysIds = this.form.get('paysId')?.value ? [this.form.get('paysId')?.value] : [];
    }

    const modalRef = this.modalService.open(this.paysModal, {
      size: 'lg',
      backdrop: 'static'
    });
  }

  // Gestion de la sélection pays dans le modal
  onPaysSelectionChange(pays: any, event: any) {
    if (this.isSearch) {
      // Mode recherche : sélection multiple avec checkboxes
      if (event.target.checked) {
        if (!this.selectedPaysIds.includes(pays.id)) {
          this.selectedPaysIds.push(pays.id);
        }
      } else {
        this.selectedPaysIds = this.selectedPaysIds.filter(id => id !== pays.id);
      }
    } else {
      // Mode ajout : sélection unique avec radio
      this.selectedPaysIds = [pays.id];
    }
  }

  // Gestion du clic sur une ligne du tableau
  onPaysRowClick(pays: any) {
    if (this.isSearch) {
      // Mode recherche : toggle checkbox
      if (this.selectedPaysIds.includes(pays.id)) {
        this.selectedPaysIds = this.selectedPaysIds.filter(id => id !== pays.id);
      } else {
        this.selectedPaysIds.push(pays.id);
      }
    } else {
      // Mode ajout : sélection unique
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
      // Mode recherche : sélection multiple
      const paysLibelles = selectedPays.map(p => p.libelle).join(', ');
      this.form.get('pays')?.setValue(paysLibelles);
      this.form.get('paysId')?.setValue(this.selectedPaysIds);
    } else {
      // Mode ajout : sélection unique
      if (selectedPays.length > 0) {
        this.form.get('pays')?.setValue(selectedPays[0].libelle);
        this.form.get('paysId')?.setValue(selectedPays[0].id);
      }
    }
    
    modal.close();
  }

  // Méthode pour charger les filières
  loadFilieres() {
    // Données statiques pour les filières
    // this.listeFilieres = [
    //   { id: 1, code: 'INFO', libelle: 'Informatique' },
    //   { id: 2, code: 'MATH', libelle: 'Mathématiques' },
    //   { id: 3, code: 'PHYS', libelle: 'Physique' },
    //   { id: 4, code: 'CHIM', libelle: 'Chimie' },
    //   { id: 5, code: 'BIO', libelle: 'Biologie' },
    //   { id: 6, code: 'ECO', libelle: 'Économie' },
    //   { id: 7, code: 'GEST', libelle: 'Gestion' },
    //   { id: 8, code: 'DROIT', libelle: 'Droit' },
    //   { id: 9, code: 'LETT', libelle: 'Lettres' },
    //   { id: 10, code: 'LANG', libelle: 'Langues' }
    // ];
      this.agentService.getAllFilere().subscribe({
    next: (data) => {
     this.listeFilieres = data; 
      console.log("Filieres => ", this.listeFilieres);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des filieres', err);
    }
  });
  }

  // Ouvrir le modal de sélection des filières
  openFiliereModal() {
    // Initialiser la sélection avec les valeurs actuelles
    this.selectedFiliereIds = this.form.get('filiereIds')?.value || [];

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

  // Exemple avec ton service agentService (adapte l’URL backend)
  
    
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
}