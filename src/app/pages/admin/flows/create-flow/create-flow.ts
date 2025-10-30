import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlowsService } from '../../../../services/flows.service';
import { CategoriesService } from '../../../../services/categories.service';
import { RolesService } from '../../../../services/roles.service';
import { Category } from '../../../../core/models/category.model';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-create-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-flow.html',
  styleUrl: './create-flow.scss'
})
export class CreateFlow implements OnInit {
  flowForm: FormGroup;
  categories: Category[] = [];
  roles: Role[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flowsService: FlowsService,
    private categoriesService: CategoriesService,
    private rolesService: RolesService
  ) {
    this.flowForm = this.fb.group({
      id_category: [null, Validators.required],
      id_role: [null, Validators.required],
      sequence: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRoles();
  }

  loadCategories(): void {
    this.categoriesService.getAllForForms().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  loadRoles(): void {
    this.rolesService.getAllForForms().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  onSubmit(): void {
    if (!this.flowForm.valid) {
      this.flowForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.flowsService.create(this.flowForm.value).subscribe({
      next: (response) => {
        alert('Flujo creado exitosamente');
        this.router.navigate(['/admin/flows']);
      },
      error: (err) => {
        console.error('Error creando flujo', err);
        alert('Error al crear flujo: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/flows']);
  }
}