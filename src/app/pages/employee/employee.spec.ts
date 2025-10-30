import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Employee } from './employee';
import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employee.service';
import { Employee as EmployeeModel } from '../../core/models/employee.model';

const mockEmployee: EmployeeModel = {
  id_employee: 1,
  cc: '123',
  name: 'Test Employee',
  state: 'ACTIVE',
  role: {
    id_role: 2,
    name: 'Confeccionista',
    description: 'Empleado',
  },
  tasks: [
    {
      id_task: 1,
      id_product: 10,
      id_employee: 1,
      id_area: 1,
      id_state: 1,
      sequence: 1,
      start_date: new Date('2024-01-01T08:00:00'),
      end_date: undefined as any,
      product: {
        id_product: 10,
        name: 'Vestido de gala',
        customized: 1,
        category_name: 'Vestidos',
        order_id: 5,
        state_name: 'En progreso',
        customized_label: 'Personalizado'
      },
      employee: undefined,
      area: {
        id_area: 1,
        name: 'Corte',
      },
      state: {
        id_state: 1,
        name: 'En progreso'
      },
      materialConsumptions: []
    }
  ]
};

class AuthServiceStub {
  getCurrentUser() {
    return { id_rol: 2, cc: '123' };
  }
}

class EmployeesServiceStub {
  getEmployeeDetails() {
    return of({ data: mockEmployee });
  }
}

describe('Employee', () => {
  let component: Employee;
  let fixture: ComponentFixture<Employee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employee],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: EmployeesService, useClass: EmployeesServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Employee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
