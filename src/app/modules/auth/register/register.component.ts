import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  userRoles = [
    { value: UserRole.AGRICULTEUR, label: 'Agriculteur' },
    { value: UserRole.ACHETEUR, label: 'Acheteur' },
    { value: UserRole.COOPERATIVE, label: 'Coopérative' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,}$/)]],
      role: [UserRole.AGRICULTEUR, [Validators.required]],
      region: [''],
      farmName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = this.registerForm.value;
      delete formValue.confirmPassword;
      
      this.authService.register(formValue).subscribe({
        next: () => {
          this.toastr.success('Inscription réussie', 'Succès');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error('Erreur lors de l\'inscription', 'Erreur');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (control?.hasError('pattern')) {
      return 'Numéro de téléphone invalide';
    }
    return '';
  }

  get passwordMismatch(): boolean {
    return !!(this.registerForm.hasError('passwordMismatch') && 
           this.registerForm.get('confirmPassword')?.touched);
  }
}

