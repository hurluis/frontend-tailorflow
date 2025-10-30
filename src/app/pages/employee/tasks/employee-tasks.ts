import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employee.service';
import { Task } from '../../../core/models/task.model';

interface StateFilter {
  label: string;
  value: string;
}

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './employee-tasks.html',
  styleUrl: './employee-tasks.scss'
})
export class EmployeeTasks implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  errorMessage = '';
  filters: StateFilter[] = [{ label: 'Todas', value: 'all' }];
  selectedFilter = 'all';
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
        this.tasks = response.data.tasks ?? [];
        this.filters = this.buildFilters(this.tasks);
        this.applyFilter('all');
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las tareas asignadas.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(value: string): void {
    this.selectedFilter = value;

    if (value === 'all') {
      this.filteredTasks = this.tasks;
      return;
    }

    this.filteredTasks = this.tasks.filter(task => this.normalizeState(task.state?.name) === value);
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

  trackTask(index: number, task: Task): number {
    return task.id_task ?? index;
  }

  private buildFilters(tasks: Task[]): StateFilter[] {
    const uniqueStates = Array.from(
      new Set(tasks.map(task => this.normalizeState(task.state?.name)).filter(Boolean))
    );

    const filters = uniqueStates.map<StateFilter>((value) => ({
      value,
      label: this.formatStateLabel(value)
    }));

    return [{ label: 'Todas', value: 'all' }, ...filters];
  }

  private normalizeState(stateName?: string): string {
    return (stateName ?? '').trim().toLowerCase();
  }

  private formatStateLabel(state: string): string {
    if (!state) {
      return 'Sin estado';
    }

    return state
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
