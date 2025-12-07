import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancementService } from '../../../core/services/financement.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-financement-form',
  templateUrl: './financement-form.component.html',
  styleUrls: ['./financement-form.component.scss']
})
export class FinancementFormComponent implements OnInit {
  financementForm!: FormGroup;
  montant = 0;
  duree = 12;
  mensualite = 0;

  constructor(
    private fb: FormBuilder,
    private financementService: FinancementService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.financementForm = this.fb.group({
      montant: [0, [Validators.required, Validators.min(100000)]],
      duree: [12, [Validators.required, Validators.min(1)]],
      motif: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.financementForm.valueChanges.subscribe(() => {
      this.calculateMensualite();
    });
  }

  calculateMensualite(): void {
    const taux = 0.05; // 5% d'intérêt
    const montant = this.financementForm.get('montant')?.value || 0;
    const duree = this.financementForm.get('duree')?.value || 12;
    
    if (montant > 0 && duree > 0) {
      this.mensualite = (montant * (1 + taux)) / duree;
    }
  }

  onSubmit(): void {
    if (this.financementForm.valid) {
      this.financementService.create(this.financementForm.value).subscribe({
        next: () => {
          this.toastr.success('Demande de financement soumise avec succès', 'Succès');
          this.router.navigate(['/dashboard/financement']);
        },
        error: () => {
          this.toastr.error('Erreur lors de la soumission', 'Erreur');
        }
      });
    }
  }
}

