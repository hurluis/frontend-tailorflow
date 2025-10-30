import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialsService } from '../../../../services/materials.service'; 
import { Material } from '../../../../core/models/material.model';


@Component({
  selector: 'app-materials-list',
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
  templateUrl: './materials-list.html',
  styleUrl: './materials-list.scss' 
})
export class MaterialsList implements OnInit {
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  materials: Material[] = [];
  dataSource = new MatTableDataSource<Material>(this.materials);
  displayedColumns: string[] = ['name', 'area', 'current_stock', 'min_stock', 'actions']; 
  isLoading = false;

  constructor(private materialsService: MaterialsService, private router: Router) { }

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    
    this.materialsService.getAllPaginated(this.currentPage, this.pageSize).subscribe({ 
      next: (response) => {
        this.materials = response.data.materials; 
        this.totalItems = response.data.total; 
        this.dataSource.data = this.materials;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando materiales', err);
        this.isLoading = false;
        alert('Error al cargar la lista de materiales: ' + (err.error?.message || 'Error de conexión')); 
        this.materials = [];
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.loadMaterials();
  }

  isLowStock(material: Material): boolean {
    return material.current_stock < material.min_stock;
  }

  createMaterial(): void {
    this.router.navigate(['/admin/materials/create']);
  }

  editMaterial(material: Material): void {
    this.router.navigate(['/admin/materials/edit', material.id_material]);
  }
}