import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaysService } from 'src/app/services/pays/pays.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-add-pays',
  templateUrl: './add-pays.component.html',
  styleUrls: ['./add-pays.component.scss']
})
export class AddPaysComponent {
 form!:FormGroup
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() paysToUpdate:any;
  @Input() isSearch: any;
  

  constructor(private paysService:PaysService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
   this.initForm();
   this.loadFileds();
  }
  
  initForm(){
    this.form = new FormGroup(
      {
        code: new FormControl("", Validators.required),
        libelle: new FormControl("", Validators.required),
      }
    )
  }

  create() {
    let pays = this.form.value;
    console.log('Pays',pays);
    this.paysService.createPays(pays).subscribe({
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

  loadFileds() {
      console.log("this.paysToUpdate : ",this.paysToUpdate);
      
      if (this.paysToUpdate !== undefined) {
        this.form?.get('code')?.setValue(this.paysToUpdate?.code);
        this.form?.get('libelle')?.setValue(this.paysToUpdate.libelle);
        }
    }
  
  
    update() {
      let pays = this.form.value;
      this.paysService.updatePays(this.paysToUpdate?.id, pays).subscribe({
        next: (data) => {
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

    save(){
      if (this.paysToUpdate){
        this.update();
      }else{
        this.create();
      }
      
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
}


