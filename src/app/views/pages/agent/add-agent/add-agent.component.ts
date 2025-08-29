import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from 'src/app/services/agent/agent.service';
import { Alertes } from 'src/app/util/alerte';
import { ChoixPaysComponent } from '../../pays/choix-pays/choix-pays.component';

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

  listePays: any[] = [];

  dateMin!: string; // YYYY-MM-DD
dateMax!: string;
agents: any[] = []; // liste des agents
allAgents: any[] = []; // liste complète pour filtrer côté front


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



  constructor(private agentService:AgentService, private paysService: AgentService,
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
  }
  initForm(){
    this.form = new FormGroup(
      {
        nomComplet: new FormControl("", Validators.required),
        matricule: new FormControl("", Validators.required),
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
        telephone: new FormControl("",Validators.required),
        postes: new FormControl("",Validators.required),
        langues: new FormControl("",Validators.required),
        departements: new FormControl("",Validators.required),
          contrat: new FormControl("", Validators.required),     
       competences: new FormControl([], Validators.required), 
       notes: new FormControl("",Validators.required),

      }
    );
   

  }

  loadPays() {
    this.paysService.getAllPays().subscribe((res: any[]) => {
      this.listePays = res;
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
    this.search.emit(this.form.value)
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

    openChoixPays() {
    const modalRef = this.modalService.open(ChoixPaysComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then((selectedPays) => {
      if (selectedPays) {
        console.log('Pays choisi : ', selectedPays);
        this.form.get('pays')?.setValue(selectedPays.libelle); // mettre le nom du pays
        // this.libellePays = selectedPays.libelle;
        console.log("pays selected", this.libellePays);
        
        this.form.get('paysId')?.setValue(selectedPays.id); // mettre le nom du pays
        // Si tu veux stocker le code dans un autre champ, tu peux aussi faire :
        // this.form.get('codePays')?.setValue(selectedPays.code);
      }
    }).catch(() => {
      console.log('Modal fermée sans sélection');
    });


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