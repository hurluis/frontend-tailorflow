import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeeProfile } from './employee-profile';
import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employee.service';
import { Employee as EmployeeModel } from '../../../core/models/employee.model';

const mockEmployee: EmployeeModel = {
  id_employee: 1,
  cc: '123',
  name: 'Test Employee',
  state: 'ACTIVO',
  role: {
    id_role: 2,
    name: 'Confeccionista',
    description: ''
  },
  tasks: []
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

describe('EmployeeProfile', () => {
  let component: EmployeeProfile;
  let fixture: ComponentFixture<EmployeeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeProfile],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: EmployeesService, useClass: EmployeesServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
