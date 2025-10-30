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
import { CategoriesService } from '../../../../services/categories.service'; 
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-categories-list',
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
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss'
})
export class CategoriesList implements OnInit {
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  categories: Category[] = [];
  dataSource = new MatTableDataSource<Category>(this.categories);
  displayedColumns: string[] = ['id_category', 'name', 'description', 'actions']; 
  isLoading = false;

  constructor(private categoriesService: CategoriesService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    
    this.categoriesService.getAllPaginated(this.currentPage, this.pageSize).subscribe({ 
      next: (response) => {
        this.categories = response.data.categories; 
        this.totalItems = response.data.total; 
        this.dataSource.data = this.categories;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.isLoading = false;
        alert('Error al cargar la lista de categorías: ' + (err.error?.message || 'Error de conexión')); 
        this.categories = [];
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  createCategory(): void {
    this.router.navigate(['/admin/categories/create']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/admin/categories/edit', category.id_category]);
  }
}