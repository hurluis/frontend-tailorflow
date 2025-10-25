import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cc: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void{
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const homeRoute = this.authService.getHomeRoute();
          this.router.navigate([homeRoute]);
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert('Credenciales inválidas');
        }
      })
    }
  }
}
