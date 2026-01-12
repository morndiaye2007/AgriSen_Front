import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {CultureService} from "../../../../services/culture.service";
import {Culture} from "../../../../core/models/Culture";


@Component({
  selector: 'app-edit-culture',
  templateUrl: './edit-culture.component.html',
  styleUrls: ['./edit-culture.component.scss']
})
export class EditCultureComponent implements OnInit {
  cultureForm: FormGroup;
  isEditMode = false;
  cultureId: number | null = null;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  categories = [
    'Céréales',
    'Légumineuses',
    'Tubercules',
    'Légumes',
    'Fruits',
    'Cultures industrielles',
    'Fourragères'
  ];

  saisons = [
    'Hivernage',
    'Saison sèche',
    'Toute l\'année'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cultureService: CultureService
  ) {
    this.cultureForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      categorie: ['', Validators.required],
      dureeCroissance: ['', [Validators.required, Validators.min(1)]],
      saisonOptimale: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.cultureId = parseInt(id);
      this.loadCulture();
    }
  }

  loadCulture(): void {
    if (!this.cultureId) return;

    this.loading = true;
    this.cultureService.getCultureById(this.cultureId).subscribe({
      next: (data) => {
        this.cultureForm.patchValue({
          nom: data.nom,
          description: data.description || '',
          categorie: data.categorie || '',
          dureeCroissance: data.dureeCroissance || '',
          saisonOptimale: data.saisonOptimale || '',
          imageUrl: data.imageUrl || ''
        });

        if (data.imageUrl) {
          this.imagePreview = data.imageUrl;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement culture:', err);
        alert('Erreur lors du chargement de la culture');
        this.router.navigate(['/cultures']);
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cultureForm.patchValue({ imageUrl: this.imagePreview });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner une image valide');
    }
  }

  onImageUrlChange(): void {
    const url = this.cultureForm.get('imageUrl')?.value;
    if (url) {
      this.imagePreview = url;
      this.selectedFile = null;
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
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

    const cultureData: Culture = {
      nom: this.cultureForm.value.nom,
      description: this.cultureForm.value.description,
      categorie: this.cultureForm.value.categorie,
      dureeCroissance: parseInt(this.cultureForm.value.dureeCroissance),
      saisonOptimale: this.cultureForm.value.saisonOptimale,
      imageUrl: this.cultureForm.value.imageUrl
    };

    const request = this.isEditMode && this.cultureId
      ? this.cultureService.updateCulture(this.cultureId, cultureData)
      : this.cultureService.createCulture(cultureData);

    request.subscribe({
      next: () => {
        const message = this.isEditMode
          ? 'Culture modifiée avec succès'
          : 'Culture créée avec succès';
        alert(message);
        this.router.navigate(['/cultures']);
      },
      error: (err) => {
        console.error('Erreur sauvegarde culture:', err);
        alert('Erreur lors de la sauvegarde de la culture');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cultures']);
  }
}
