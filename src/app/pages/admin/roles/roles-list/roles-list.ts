import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RolesService } from '../../../../services/roles.service'; 
import { Role } from '../../../../core/models/role.model'; 

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss'
})
export class RolesList implements OnInit {
  roles: Role[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  displayedColumns: string[] = ['name', 'description', 'area', 'actions']; 
  isLoading = false;

  constructor(private rolesService: RolesService, private router: Router) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.rolesService.getAll(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.roles = response.data.roles;
        this.total = response.data.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando roles', err);
        this.isLoading = false;
        alert('Error al cargar la lista de roles.');
      }
    });
  }

  createRole(): void {
    this.router.navigate(['/admin/roles/create']); 
  }

  editRole(role: Role): void {
    this.router.navigate(['/admin/roles/edit', role.id_role]);
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }
}