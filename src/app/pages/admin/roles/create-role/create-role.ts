import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatSelectModule } from '@angular/material/select'; // Necesario para seleccionar el área
import { forkJoin } from 'rxjs';

// Servicios y Modelos
import { RolesService } from '../../../../services/roles.service';
// Asumo un servicio para obtener áreas, necesario para el campo id_area
import { AreasService } from '../../../../services/areas.service'; 
import { Area } from '../../../../core/models/area.model'; 

@Component({
  selector: 'app-create-role',
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
    MatSelectModule
  ],
  templateUrl: './create-role.html',
  styleUrl: './create-role.scss'
})
export class CreateRole implements OnInit {
  createForm!: FormGroup;
  isSaving = false;
  isLoading = true; // Para cargar la lista de áreas
  areas: Area[] = []; // Lista de áreas para el <mat-select>

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private areasService: AreasService // Servicio asumido para obtener áreas
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDependencies(); // Cargar áreas
  }
  
  /**
   * Carga dependencias necesarias, como la lista de áreas.
   */
  loadDependencies(): void {
    this.areasService.getAllForForms().subscribe({
      next: (response) => {
        this.areas = response.data; // Asumo que response.data es el array de áreas
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando áreas', err);
        alert('Error al cargar la lista de áreas. No se puede crear el rol.');
        this.router.navigate(['/admin/roles']);
      }
    });
  }

  initForm(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      id_area: [null, [Validators.required, Validators.min(1)]] // id_area obligatorio y numérico
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    const roleData = this.createForm.value;

    this.rolesService.create(roleData).subscribe({
      next: () => {
        alert('Rol creado exitosamente');
        this.router.navigate(['/admin/roles']);
      },
      error: (err) => {
        console.error('Error creando rol', err);
        alert('Error al crear rol: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/roles']);
  }
}