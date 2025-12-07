import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeActivite } from '../../../core/models/journal.model';
import { JournalService } from '../../../core/services/journal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss']
})
export class JournalFormComponent implements OnInit {
  journalForm!: FormGroup;
  typesActivite = Object.values(TypeActivite);
  parcelles = [
    { id: '1', nom: 'Champ A - Route Baobab' },
    { id: '2', nom: 'Parcelle B - Près du fleuve' },
    { id: '3', nom: 'Champ C - Zone Nord' },
    { id: '4', nom: 'Parcelle D - Zone Sud' }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private journalService: JournalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.journalForm = this.fb.group({
      parcelleId: ['', [Validators.required]],
      type: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      description: ['', [Validators.required]],
      cout: [0],
      quantite: [0],
      unite: [''],
      observations: ['']
    });
  }

  onSubmit(): void {
    if (this.journalForm.valid) {
      this.journalService.create(this.journalForm.value).subscribe({
        next: () => {
          this.toastr.success('Activité enregistrée avec succès', 'Succès');
          this.router.navigate(['/dashboard/journal']);
        },
        error: () => {
          this.toastr.error('Erreur lors de l\'enregistrement', 'Erreur');
        }
      });
    }
  }
}

