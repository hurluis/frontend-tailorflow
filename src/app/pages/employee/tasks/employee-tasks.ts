import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employee.service';
import { TasksService } from '../../../services/tasks.service';
import { Task } from '../../../core/models/task.model';
import { finalize } from 'rxjs/operators';

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
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule
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
  readonly displayedColumns: string[] = ['sequence', 'product', 'area', 'state', 'start', 'end', 'actions'];
  private readonly actionLoading = new Set<number>();

  constructor(
    private readonly authService: AuthService,
    private readonly employeesService: EmployeesService,
    private readonly tasksService: TasksService,
    private readonly snackBar: MatSnackBar
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

  isActionLoading(taskId?: number | null): boolean {
    if (!taskId) {
      return false;
    }

    return this.actionLoading.has(taskId);
  }

  markTaskAsInProgress(task: Task): void {
    if (!task.id_task || this.isActionLoading(task.id_task)) {
      return;
    }

    this.setActionLoading(task.id_task, true);

    this.tasksService
      .startTask(task.id_task)
      .pipe(finalize(() => this.setActionLoading(task.id_task!, false)))
      .subscribe({
        next: ({ data }) => {
          this.applyTaskUpdate(data);
          this.showFeedback('Tarea marcada como en progreso.');
        },
        error: () => {
          this.showFeedback('No fue posible actualizar la tarea. Intenta nuevamente.', true);
        }
      });
  }

  markTaskAsCompleted(task: Task): void {
    if (!task.id_task || this.isActionLoading(task.id_task)) {
      return;
    }

    this.setActionLoading(task.id_task, true);

    this.tasksService
      .completeTask(task.id_task)
      .pipe(finalize(() => this.setActionLoading(task.id_task!, false)))
      .subscribe({
        next: ({ data }) => {
          this.applyTaskUpdate(data);
          this.showFeedback('¡Excelente! Tarea marcada como finalizada.');
        },
        error: () => {
          this.showFeedback('No fue posible finalizar la tarea. Intenta nuevamente.', true);
        }
      });
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

  private setActionLoading(taskId: number, isLoading: boolean): void {
    if (isLoading) {
      this.actionLoading.add(taskId);
      return;
    }

    this.actionLoading.delete(taskId);
  }

  private applyTaskUpdate(updatedTask: Task): void {
    if (!updatedTask?.id_task) {
      return;
    }

    this.tasks = this.tasks.map((task) =>
      task.id_task === updatedTask.id_task ? { ...task, ...updatedTask } : task
    );

    this.filters = this.buildFilters(this.tasks);
    this.applyFilter(this.selectedFilter);
  }

  private showFeedback(message: string, isError = false): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      politeness: isError ? 'assertive' : 'polite'
    });
  }
}
