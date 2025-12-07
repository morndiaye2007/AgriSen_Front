import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;
  profilePicture: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForms();
  }

  initForms(): void {
    this.profilForm = this.fb.group({
      firstName: [this.currentUser?.firstName || '', [Validators.required]],
      lastName: [this.currentUser?.lastName || '', [Validators.required]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: [this.currentUser?.phone || '', [Validators.required]],
      region: [this.currentUser?.region || ''],
      farmName: [this.currentUser?.farmName || '']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Traiter l'upload de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfil(): void {
    if (this.profilForm.valid) {
      // Mettre à jour le profil
      this.toastr.success('Profil mis à jour', 'Succès');
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      // Changer le mot de passe
      this.toastr.success('Mot de passe changé', 'Succès');
      this.passwordForm.reset();
    }
  }
}

