import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { OracleProceduresService } from '../../../../services/oracle services/oracle-procedures.service';
import { OrderTracking } from '../../../../core/models oracle/order-tracking.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.scss'
})
export class OrderTrackingComponent {
  searchForm: FormGroup;
  trackingData: OrderTracking[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private oracleProceduresService: OracleProceduresService
  ) {
    this.searchForm = this.fb.group({
      orderId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onSearch(): void {
    if (!this.searchForm.valid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    const orderId = this.searchForm.value.orderId;

    this.oracleProceduresService.getOrderTracking(orderId).subscribe({
      next: (response) => {
        console.log('Datos recibidos:', response);
        this.trackingData = response.data || [];
        console.log('trackingData asignado:', this.trackingData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error obteniendo seguimiento', err);
        alert('Error al obtener el seguimiento del pedido');
        this.isLoading = false;
        this.trackingData = [];
      }
    });
  }

  get groupedByProduct(): { productId: number; tasks: OrderTracking[] }[] {
    if (!this.trackingData || this.trackingData.length === 0) {
      return [];
    }

    const grouped = new Map<number, OrderTracking[]>();

    this.trackingData.forEach(item => {
      const productId = item.id_product; 
      if (!grouped.has(productId)) {
        grouped.set(productId, []);
      }
      grouped.get(productId)!.push(item);
    });

    return Array.from(grouped.entries()).map(([productId, tasks]) => ({
      productId,
      tasks: tasks.sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) 
    }));
  }

  getTaskStatusClass(status: string | undefined | null): string {
    if (!status) return 'status-unknown';
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}