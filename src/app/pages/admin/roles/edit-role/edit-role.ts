import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 

// Servicios y Modelos
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './edit-role.html',
  styleUrl: './edit-role.scss'
})
export class EditRole implements OnInit {
  editForm!: FormGroup;
  roleId!: number;
  role!: Role;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef // Para forzar la detección de cambios
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.params['id'];
    this.loadRole();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      // Campo de visualización de área (deshabilitado)
      areaName: [{ value: '', disabled: true }], 
      name: ['', [Validators.required, Validators.maxLength(50)]], // Requerido en UpdateRoleDto
      description: ['', [Validators.required, Validators.maxLength(100)]] // Requerido en UpdateRoleDto
    });
  }

  loadRole(): void {
    this.rolesService.getById(this.roleId).subscribe({
      next: (response) => {
        this.role = response.data;

        this.editForm.patchValue({
          areaName: this.role.area?.name || 'N/A', // Muestra el nombre del área actual
          name: this.role.name,
          description: this.role.description
        });

        this.isLoading = false;
        this.cdr.detectChanges(); // Asegura que el formulario se muestre
      },
      error: (err) => {
        console.error('Error cargando rol', err);
        alert('Error al cargar el rol');
        this.router.navigate(['/admin/roles']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    // Usamos .getRawValue() para incluir los campos deshabilitados (si los hubiera) 
    // pero en este caso solo necesitamos los valores del formulario.
    const { name, description } = this.editForm.value;

    const updateData: any = {
      name: name,
      description: description
      // No incluimos campos opcionales, tu DTO acepta todos
    };

    this.rolesService.update(this.roleId, updateData).subscribe({
      next: () => {
        alert('Rol actualizado exitosamente');
        this.router.navigate(['/admin/roles']);
      },
      error: (err) => {
        console.error('Error actualizando rol', err);
        alert('Error al actualizar rol: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/roles']);
  }
}