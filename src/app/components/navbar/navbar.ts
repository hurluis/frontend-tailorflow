import { Component, EventEmitter, Output, OnInit } from '@angular/core'; // <<-- AÑADIDO: OnInit
import { CommonModule } from '@angular/common'; // <<-- AÑADIDO: Necesario para directivas
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit { 
  @Output() sidebarToggle = new EventEmitter<void>();
  userName: string = 'Cargando...'; 
  notificationCount: number = 3; 

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {

  }

  ngOnInit(): void { 
    const current = this.authService.getCurrentUser();
    
    if (current?.cc) {
      this.employeeService.getEmployeeDetails(current.cc).subscribe({
        next: (response) => {
          const employee = response.data;
          this.userName = employee.name || 'Usuario';
        },
        error: (err) => {
          this.userName = current.cc;
          console.error('Error al obtener datos del empleado:', err);
        }
      });
    } else {
      this.userName = 'Usuario Desconocido';
    }
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onNotifications(): void {

    console.log('Ver notificaciones');
  }
}
