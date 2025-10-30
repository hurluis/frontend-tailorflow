import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeeTasks } from './employee-tasks';
import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employee.service';
import { Task } from '../../../core/models/task.model';

const mockTasks: Task[] = [
  {
    id_task: 1,
    id_product: 1,
    id_employee: 1,
    id_area: 1,
    id_state: 1,
    sequence: 1,
    start_date: new Date('2024-01-01T08:00:00'),
    end_date: undefined as any,
    product: {
      id_product: 1,
      name: 'Vestido azul',
      customized: 1,
      category_name: 'Vestidos',
      order_id: 1,
      state_name: 'En progreso',
      customized_label: 'Personalizado'
    },
    area: { id_area: 1, name: 'Corte' },
    state: { id_state: 1, name: 'En progreso' },
    employee: undefined,
    materialConsumptions: []
  }
];

class AuthServiceStub {
  getCurrentUser() {
    return { id_rol: 2, cc: '123' };
  }
}

class EmployeesServiceStub {
  getEmployeeDetails() {
    return of({ data: { tasks: mockTasks } });
  }
}

describe('EmployeeTasks', () => {
  let component: EmployeeTasks;
  let fixture: ComponentFixture<EmployeeTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTasks],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: EmployeesService, useClass: EmployeesServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
