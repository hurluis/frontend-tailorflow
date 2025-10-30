import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employee.service';
import { Employee as EmployeeModel } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.scss'
})
export class EmployeeProfile implements OnInit {
  employee: EmployeeModel | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    const current = this.authService.getCurrentUser();

    if (!current?.cc) {
      this.isLoading = false;
      this.errorMessage = 'No se pudo determinar el colaborador actual.';
      return;
    }

    this.employeesService.getEmployeeDetails(current.cc).subscribe({
      next: (response) => {
        this.employee = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar tu perfil.';
        this.isLoading = false;
      }
    });
  }

  get status(): string {
    return this.employee?.state ?? 'Sin estado';
  }

  get statusClass(): string {
    const state = this.status.toLowerCase();

    if (state.includes('inactivo') || state.includes('suspendido')) {
      return 'status-inactive';
    }

    return 'status-active';
  }

  get totalTasks(): number {
    return this.employee?.tasks?.length ?? 0;
  }
}
