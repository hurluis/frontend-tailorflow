import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeLayout } from './employee-layout';
import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employee.service';

class AuthServiceStub {
  getCurrentUser() {
    return { id_rol: 2, cc: '123' };
  }
}

class EmployeesServiceStub {
  getEmployeeDetails() {
    return of({ data: { name: 'Test User' } });
  }
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('EmployeeLayout', () => {
  let component: EmployeeLayout;
  let fixture: ComponentFixture<EmployeeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLayout],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: EmployeesService, useClass: EmployeesServiceStub },
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
