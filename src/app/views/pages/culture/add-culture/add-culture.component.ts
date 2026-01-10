import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CultureService } from '../../../../services/culture.service';
import { Culture } from '../../../../core/models/Culture';

@Component({
  selector: 'app-add-culture',
  templateUrl: './add-culture.component.html',
  styleUrls: ['./add-culture.component.scss']
})
export class AddCultureComponent implements OnInit {
  cultureForm!: FormGroup;
  loading = false;
  error = '';
  imagePreview: string | null = null;

  categories = [
    'Céréales',
    'Légumineuses',
    'Fruits',
    'Légumes',
    'Tubercules',
    'Oléagineux'
  ];

  saisons = [
    'Hivernage',
    'Saison sèche',
    'Toute l\'année'
  ];

  constructor(
    private fb: FormBuilder,
    private cultureService: CultureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.cultureForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      categorie: ['', [Validators.required]],
      dureeCroissance: ['', [Validators.min(1)]],
      saisonOptimale: [''],
      imageUrl: ['']
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cultureForm.patchValue({ imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.cultureForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.cultureForm.invalid) {
      Object.keys(this.cultureForm.controls).forEach(key => {
        this.cultureForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    this.cultureService.createCulture(this.cultureForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/culture']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors de la création';
        console.error('Error creating culture:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/culture']);
  }
}
