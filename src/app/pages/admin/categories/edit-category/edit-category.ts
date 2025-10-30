import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss'
})
export class EditCategory implements OnInit {
  editForm!: FormGroup;
  categoryId!: number;
  category!: Category;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef 
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Obtiene el ID de la URL
    this.categoryId = +this.route.snapshot.params['id']; 
    this.loadCategory();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      // Validaciones basadas en UpdateCategoryDto
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  /**
   * Carga los datos de la categoría por su ID.
   */
  loadCategory(): void {
    this.categoriesService.getById(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.data;

        this.editForm.patchValue({
          name: this.category.name,
          description: this.category.description
        });

        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => {
        console.error('Error cargando categoría', err);
        alert('Error al cargar la categoría para edición: ' + (err.error?.message || 'Error de conexión'));
        this.router.navigate(['/admin/categories']); 
      }
    });
  }

  /**
   * Envía la data de actualización al backend.
   */
  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    // Usamos UpdateCategoryDto para el envío
    const updateData: Category = this.editForm.value; 

    this.categoriesService.update(this.categoryId, updateData).subscribe({
      next: () => {
        alert(`Categoría "${updateData.name}" actualizada exitosamente`);
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error actualizando categoría', err);
        alert('Error al actualizar categoría: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}