import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employee.service';
import { Employee as EmployeeModel } from '../../core/models/employee.model';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class Employee implements OnInit {
  employee: EmployeeModel | null = null;
  isLoading = true;
  errorMessage = '';
  readonly displayedColumns: string[] = ['sequence', 'product', 'area', 'state', 'start', 'end'];

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
        this.errorMessage = 'No fue posible cargar tus datos. Intenta nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  get tasks(): Task[] {
    return this.employee?.tasks ?? [];
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => !!task.end_date).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => !task.start_date).length;
  }

  get inProgressTasks(): number {
    return this.totalTasks - this.completedTasks - this.pendingTasks;
  }

  get collaboratorName(): string {
    return this.employee?.name ?? 'Colaborador';
  }

  get roleName(): string {
    return this.employee?.role?.name ?? 'Empleado';
  }

  trackTask(index: number, task: Task): number {
    return task.id_task ?? index;
  }

  getStateClass(task: Task): string {
    const stateName = task.state?.name?.toLowerCase() ?? '';

    if (stateName.includes('final') || stateName.includes('complet')) {
      return 'state-completed';
    }

    if (stateName.includes('progres') || stateName.includes('process')) {
      return 'state-progress';
    }

    if (stateName.includes('pend')) {
      return 'state-pending';
    }

    return 'state-default';
  }
}
