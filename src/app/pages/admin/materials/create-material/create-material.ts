import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MaterialsService } from '../../../../services/materials.service';
import { AreasService } from '../../../../services/areas.service';
import { Area } from '../../../../core/models/area.model';

@Component({
  selector: 'app-create-material',
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-material.html',
  styleUrl: './create-material.scss'
})
export class CreateMaterial implements OnInit {
  createForm!: FormGroup;
  isSaving = false;
  areas$!: Observable<Area[]>;
  isLoadingAreas = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private materialsService: MaterialsService,
    private areasService: AreasService
  ) {
    this.initForm();
  }

  ngOnInit(): void { 
    this.loadAreas();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      id_area: [null, [Validators.required, Validators.min(1)]], 
      name: ['', [Validators.required, Validators.maxLength(100)]], 
      current_stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]], 
      min_stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]] 
    });
  }


  loadAreas(): void {
    this.isLoadingAreas = true;
    this.areas$ = this.areasService.getAllForForms().pipe(

      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('La respuesta de áreas está vacía.');
      }),
      catchError((err) => {
        console.error('Error cargando áreas:', err);
        alert('Error al cargar la lista de Áreas. Verifique la conexión.');
        this.isLoadingAreas = false;

        return of([]); 
      })
    );


    this.areas$.subscribe({
        next: () => this.isLoadingAreas = false,
        error: () => this.isLoadingAreas = false 
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const materialData = {
        ...this.createForm.value,
        current_stock: Number(this.createForm.value.current_stock),
        min_stock: Number(this.createForm.value.min_stock)
    };

    this.materialsService.create(materialData).subscribe({
      next: (response) => {
        alert('Material "' + response.data.name + '" creado exitosamente.');
        this.router.navigate(['/admin/materials']); 
      },
      error: (err) => {
        console.error('Error creando material', err);
        alert('Error al crear material: ' + (err.error?.message || 'Error de conexión')); 
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/materials']); 
  }
}