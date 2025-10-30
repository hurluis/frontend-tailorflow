import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators'; 
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
import { Material } from '../../../../core/models/material.model';

type MaterialUpdatePayload = {
    name?: string;
    current_stock?: number;
    min_stock?: number;
}


@Component({
  selector: 'app-edit-material',
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
  templateUrl: './edit-material.html',
  styleUrls: ['./edit-material.scss']
})
export class EditMaterial implements OnInit {
  editForm!: FormGroup;
  materialId!: number;
  isSaving = false;
  isLoadingData = true;
  areas$!: Observable<Area[]>;
  initialMaterialData: Material | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private areasService: AreasService
  ) {
    this.initForm();
  }

  ngOnInit(): void { 
    const id = this.route.snapshot.paramMap.get('id');
    this.materialId = Number(id);

    if (!this.materialId || isNaN(this.materialId)) {
      alert('ID de material no válido.');
      this.router.navigate(['/admin/materials']);
      return;
    }
    this.loadData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id_area: [{ value: null, disabled: false }, [Validators.required, Validators.min(1)]], 
      name: ['', [Validators.required, Validators.maxLength(100)]], 
      current_stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]], 
      min_stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]] 
    });
  }

  loadData(): void {
    this.isLoadingData = true;

    const areasObservable = this.areasService.getAllForForms().pipe(
      map(response => {
          if (response.data) {
              return response.data;
          }
          throw new Error('No hay datos de áreas.');
      }),
      catchError((err) => {
        console.error('Error cargando áreas:', err);
        return of([]); 
      })
    );
    this.areas$ = areasObservable;

    const materialObservable = this.materialsService.getById(this.materialId).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Material no encontrado.');
        }
        return response.data;
      }),
      catchError((err) => {
        console.error('Error cargando material:', err);
        alert('Error al cargar material: ' + (err.error?.message || 'Error de conexión'));
        this.router.navigate(['/admin/materials']);
        return of(null);
      })
    );

    forkJoin({
      material: materialObservable,
      areas: areasObservable 
    }).subscribe({
      next: (results) => {
        if (results.material) {
            this.initialMaterialData = results.material;
            
            this.editForm.patchValue({
              id_area: this.initialMaterialData.id_area,
              name: this.initialMaterialData.name,
              current_stock: this.initialMaterialData.current_stock,
              min_stock: this.initialMaterialData.min_stock
            });

            this.editForm.get('id_area')?.disable(); 
        }
        this.isLoadingData = false;
      },
      error: () => {
        this.isLoadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    const formValue = this.editForm.getRawValue(); 
    const updateData: MaterialUpdatePayload = {};
    
    if (this.initialMaterialData) {
        if (formValue.name !== this.initialMaterialData.name) {
            updateData.name = formValue.name;
        }
        
        const newStock = Number(formValue.current_stock);
        const newMinStock = Number(formValue.min_stock);

        if (newStock !== this.initialMaterialData.current_stock) {
            updateData.current_stock = newStock;
        }
        if (newMinStock !== this.initialMaterialData.min_stock) {
            updateData.min_stock = newMinStock;
        }
    }
    
    if (Object.keys(updateData).length === 0) {
        alert('No se detectaron cambios para guardar.');
        this.isSaving = false;
        return;
    }

    this.materialsService.update(this.materialId, updateData).subscribe({
      next: (response) => {
        alert('Material "' + response.data.name + '" actualizado exitosamente.');
        this.router.navigate(['/admin/materials']); 
      },
      error: (err) => {
        console.error('Error actualizando material', err);
        alert('Error al actualizar material: ' + (err.error?.message || 'Error de conexión'));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/materials']); 
  }
}