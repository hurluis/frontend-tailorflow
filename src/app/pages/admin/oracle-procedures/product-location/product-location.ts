import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { OracleProceduresService } from '../../../../services/oracle services/oracle-procedures.service';
import { ProductLocation } from '../../../../core/models oracle/product-location.model';

@Component({
  selector: 'app-product-location',
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
  templateUrl: './product-location.html',
  styleUrl: './product-location.scss'
})
export class ProductLocationComponent {
  searchForm: FormGroup;
  locationData: ProductLocation[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private oracleProceduresService: OracleProceduresService
  ) {
    this.searchForm = this.fb.group({
      productId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onSearch(): void {
    if (!this.searchForm.valid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    const productId = this.searchForm.value.productId;

    this.oracleProceduresService.getProductLocation(productId).subscribe({
      next: (response) => {
        this.locationData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error obteniendo ubicación', err);
        alert('Error al obtener la ubicación del producto');
        this.isLoading = false;
        this.locationData = [];
      }
    });
  }

  get currentTask() {
    return this.locationData.find(task => !task.end_date);
  }

  get completedTasks() {
    return this.locationData.filter(task => task.end_date);
  }

  get pendingTasks() {
    return this.locationData.filter(task => !task.start_date && !task.end_date);
  }

  getProgressPercentage(): number {
    if (this.locationData.length === 0) return 0;
    const completed = this.locationData[0].completed_tasks;
    const total = this.locationData[0].total_tasks;
    return Math.round((completed / total) * 100);
  }
}