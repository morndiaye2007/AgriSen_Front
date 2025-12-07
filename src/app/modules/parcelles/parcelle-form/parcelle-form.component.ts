import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcellesService } from '../../../core/services/parcelles.service';
import { ToastrService } from 'ngx-toastr';
import { Parcelle } from '../../../core/models/parcelle.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-parcelle-form',
  templateUrl: './parcelle-form.component.html',
  styleUrls: ['./parcelle-form.component.scss']
})
export class ParcelleFormComponent implements OnInit {
  parcelleForm!: FormGroup;
  isEditMode = false;
  parcelleId: string | null = null;
  mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: [14.7167, -17.4677] as [number, number] // Dakar par défaut
  };
  selectedCoordinates: [number, number] = [14.7167, -17.4677];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private parcellesService: ParcellesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.parcelleId = this.route.snapshot.paramMap.get('id');
    if (this.parcelleId && this.parcelleId !== 'new') {
      this.isEditMode = true;
      this.loadParcelle();
    }
  }

  initForm(): void {
    this.parcelleForm = this.fb.group({
      nom: ['', [Validators.required]],
      taille: ['', [Validators.required, Validators.min(0.1)]],
      region: ['', [Validators.required]],
      latitude: [this.selectedCoordinates[0], [Validators.required]],
      longitude: [this.selectedCoordinates[1], [Validators.required]]
    });
  }

  loadParcelle(): void {
    if (this.parcelleId) {
      this.parcellesService.getById(this.parcelleId).subscribe({
        next: (parcelle) => {
          this.parcelleForm.patchValue({
            nom: parcelle.nom,
            taille: parcelle.taille,
            region: parcelle.region,
            latitude: parcelle.coordonneesGPS.latitude,
            longitude: parcelle.coordonneesGPS.longitude
          });
          this.selectedCoordinates = [
            parcelle.coordonneesGPS.latitude,
            parcelle.coordonneesGPS.longitude
          ];
        },
        error: () => {
          this.toastr.error('Erreur lors du chargement', 'Erreur');
        }
      });
    }
  }

  onMapClick(event: any): void {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    this.selectedCoordinates = [lat, lng];
    this.parcelleForm.patchValue({
      latitude: lat,
      longitude: lng
    });
  }

  onSubmit(): void {
    if (this.parcelleForm.valid) {
      const formValue = this.parcelleForm.value;
      const parcelleData: Partial<Parcelle> = {
        nom: formValue.nom,
        taille: formValue.taille,
        region: formValue.region,
        coordonneesGPS: {
          latitude: formValue.latitude,
          longitude: formValue.longitude
        }
      };

      if (this.isEditMode && this.parcelleId) {
        this.parcellesService.update(this.parcelleId, parcelleData).subscribe({
          next: () => {
            this.toastr.success('Parcelle modifiée avec succès', 'Succès');
            this.router.navigate(['/dashboard/parcelles']);
          },
          error: () => {
            this.toastr.error('Erreur lors de la modification', 'Erreur');
          }
        });
      } else {
        this.parcellesService.create(parcelleData).subscribe({
          next: () => {
            this.toastr.success('Parcelle créée avec succès', 'Succès');
            this.router.navigate(['/dashboard/parcelles']);
          },
          error: () => {
            this.toastr.error('Erreur lors de la création', 'Erreur');
          }
        });
      }
    }
  }
}

