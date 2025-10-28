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
    CommonModule, // Necesario para directivas básicas y pipes
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit { // <<-- IMPLEMENTAR: OnInit
  @Output() sidebarToggle = new EventEmitter<void>();
  userName: string = 'Cargando...'; 
  notificationCount: number = 3; 

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // La lógica de carga de datos debe ir en ngOnInit, no en el constructor.
  }

  ngOnInit(): void { // <<-- MÉTODO DE INICIALIZACIÓN
    const current = this.authService.getCurrentUser();
    
    if (current?.cc) {
      this.employeeService.getEmployeeDetails(current.cc).subscribe({
        next: (response) => {
          // Accede a la propiedad .data, que contiene el objeto Employee
          const employee = response.data;
          
          // Asumiendo que el campo se llama 'nombreCompleto' en tu modelo Employee
          this.userName = employee.name || 'Usuario';
        },
        error: (err) => {
          // Si falla la API, muestra al menos el CC
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
