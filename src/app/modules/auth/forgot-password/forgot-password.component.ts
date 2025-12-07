import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: () => {
          this.loading = false;
          this.emailSent = true;
          this.toastr.success('Un email de réinitialisation a été envoyé', 'Succès');
        },
        error: () => {
          this.loading = false;
          this.toastr.error('Erreur lors de l\'envoi de l\'email', 'Erreur');
        }
      });
    }
  }
}

