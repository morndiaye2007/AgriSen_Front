import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from 'src/app/services/agent/agent.service';
import { Alertes } from 'src/app/util/alerte';
import { Helper } from 'src/app/util/helper';
import { ChoixPaysComponent } from '../../pays/choix-pays/choix-pays.component';


@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.scss']
})
export class EditAgentComponent {
  form!: FormGroup
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() agentToUpdate: any;
  @Input() isSearch: any;
  libellePays : string='k';
  sexe=[
    {name:'MASCULIN',description:'Masculin'},
    {name:'FEMININ',description:'Feminin'},
  ]

   preferences=[
    {name:'SPORT',description:'Sport'},
    {name:'CUISINE',description:'Cuisine'},
    {name:'LECTURE',description:'Lecture'},
  ]

  // pays=[
  //   {name:'France',description:'France'},
  //   {name:'Canada',description:'Canada'},
  //   {name:'Senegal',description:'Senegal'},
  //   {name:'Maroc',description:'Maroc'}
  // ]


  constructor(private agentService: AgentService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {

    this.form = new FormGroup(
      {
       nomComplet: new FormControl("", Validators.required),
        matricule: new FormControl("", Validators.required),
        motdepasse: new FormControl(""),
        email: new FormControl("", Validators.required),
        description: new FormControl(""),
        age: new FormControl("",),
        dateNaissance: new FormControl("",Validators.required),
        sexe: new FormControl("",),
        preferences: new FormArray([]),
        pays: new FormControl({ value: '', disabled: true }),
        paysId: new FormControl(null),
        telephone: new FormControl("",Validators.required),
      }
    )
    this.loadFileds()
  }
  loadFileds() {
    console.log("this.agentToUpdate : ",this.agentToUpdate);
    
    //   // this.form?.get('heure')?.setValue(this.agentToUpdate?.heure);
    //   // this.form?.get('preferences')?.setValue(this.agentToUpdate?.preferences);
    //   // this.form?.get('pays')?.setValue(this.agentToUpdate?.pays.libelle);
    //   this.form?.get('telephone')?.setValue(this.agentToUpdate?.telephone);
    if (this.agentToUpdate !== undefined) {
    this.form.get('nomComplet')?.setValue(this.agentToUpdate?.nomComplet);
    this.form.get('matricule')?.setValue(this.agentToUpdate?.matricule);
    this.form.get('motdepasse')?.setValue(this.agentToUpdate?.motdepasse);
    this.form.get('email')?.setValue(this.agentToUpdate?.email);
    this.form.get('description')?.setValue(this.agentToUpdate?.description);
    this.form.get('age')?.setValue(this.agentToUpdate?.age);
    this.form.get('dateNaissance')?.setValue(Helper.editDate(this.agentToUpdate?.dateNaissance));

    //  Ajout du champ heure dans le FormGroup avant d'affecter
    if (!this.form.contains('heure')) {
      this.form.addControl('heure', new FormControl(''));
    }
    this.form.get('heure')?.setValue(this.agentToUpdate?.heure);

    this.form.get('sexe')?.setValue(this.agentToUpdate?.sexe.name);

    // Pour preferences (FormArray), on le remplit correctement
    const preferencesArray = this.form.get('preferences') as FormArray;
    preferencesArray.clear(); // On nettoie d'abord
    if (Array.isArray(this.agentToUpdate?.preferences)) {
      this.agentToUpdate.preferences.forEach((pref: string) => {
        preferencesArray.push(new FormControl(pref));
      });
    }

    // Pour pays, il est disabled → il faut le réactiver avant setValue
    this.form.get('pays')?.enable();
    this.form.get('pays')?.setValue(this.agentToUpdate?.pays.libelle);
    this.form.get('pays')?.disable(); // On le remet disabled après

    this.form.get('telephone')?.setValue(this.agentToUpdate?.telephone);
  }

  }


  update() {
    let agent = this.form.value;
        agent.pays =undefined
this.form.get('paysId')?.setValue(this.agentToUpdate.pays?.id); 
    // console.log('Agent',agent);
    this.agentService.updateAgent(this.agentToUpdate?.id, agent).subscribe({
      next: () => {
        Alertes.alerteUpdateSuccess('Modification reussie');
        this.emitSubmit()
      },
      error: (error) => {
        Alertes.alerteAddDanger(error.error.message)
      },
      complete: () => {
        this.close()
      }
    })
  }

  close() {
    this.modalService.dismissAll();
  }

  doSearch() {
    this.search.emit(this.form.value)
  }

  emitSubmit() {
    this.submit.emit(true);
  }

    

  openChoixPays() {
  const modalRef = this.modalService.open(ChoixPaysComponent, {
    size: 'lg',
    backdrop: 'static'
  });}


  //  modalRef.result: any.then((selectedPays) => {
  //     if (selectedPays) {
  //       console.log('Pays choisi : ', selectedPays);
  //       this.form.get('pays')?.setValue(selectedPays.libelle); // mettre le nom du pays
  //       // this.libellePays = selectedPays.libelle;
  //       console.log("pays selected", this.libellePays);
        
  //       this.form.get('paysId')?.setValue(selectedPays.id); // mettre le nom du pays
  //       // Si tu veux stocker le code dans un autre champ, tu peux aussi faire :
  //       // this.form.get('codePays')?.setValue(selectedPays.code);
  //     }
  //   }).catch(() => {
  //     console.log('Modal fermée sans sélection');
  //   });

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
