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

  postes: any[] = [];
  //formations: any[] = [];
    departements: any[] = [];
  langues: any[] = [];

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



  constructor(private agentService:AgentService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }
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
       // formations: new FormControl("",Validators.required),

      }
    );
   

  }

  loadPostes(): void {
    this.agentService.getAllPoste().subscribe({

      next: (data) => {
        this.postes = data;
         console.log("data",data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des postes', err);
      }
    });
  }

  loadLangues(): void {
    this.agentService.getAllLangues().subscribe({
      next: (data) => {
        this.postes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des postes', err);
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

  loadDepartements(): void {
    this.agentService.getAllDepartement().subscribe({
      next: (data) => {
        this.departements = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des départements', err);
      }
    });
  }
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
}



