import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AreasService } from '../../../../services/areas.service'; 
import { Area } from '../../../../core/models/area.model';

@Component({
  selector: 'app-areas-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './areas-list.html',
  styleUrl: './areas-list.scss'
})
export class AreasList implements OnInit {
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  areas: Area[] = [];
  dataSource = new MatTableDataSource<Area>(this.areas);
  displayedColumns: string[] = ['name', 'roles_count', 'actions']; 
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private areasService: AreasService, private router: Router) { }

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.isLoading = true;
    
    this.areasService.getAllPaginated(this.currentPage, this.pageSize).subscribe({ 
      next: (response) => {
        this.areas = response.data.areas; 
        this.totalItems = response.data.total; 
        this.dataSource.data = this.areas;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando áreas', err);
        this.isLoading = false;
        alert('Error al cargar la lista de áreas: ' + (err.error?.message || 'Error de conexión')); 
        this.areas = [];
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.loadAreas();
  }

  createArea(): void {
    this.router.navigate(['/admin/areas/create']);
  }

  editArea(area: Area): void {
    this.router.navigate(['/admin/areas/edit', area.id_area]);
  }
}