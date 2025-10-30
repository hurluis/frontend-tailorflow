import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Navbar } from './navbar';
import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employee.service';

class AuthServiceStub {
  getCurrentUser() {
    return { id_rol: 2, cc: '123' };
  }

  logout(): void {}
}

class EmployeesServiceStub {
  getEmployeeDetails() {
    return of({ data: { name: 'Test User' } });
  }
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: EmployeesService, useClass: EmployeesServiceStub },
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
