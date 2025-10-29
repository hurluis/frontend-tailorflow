// order-details-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core'; // ← Agregar OnInit
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../services/orders.service';
import { ProductDetail } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule // ← Verificar que esté
  ],
  templateUrl: './order-details-dialog.html',
  styleUrl: './order-details-dialog.scss'
})
export class OrderDetailsDialog implements OnInit { // ← Agregar OnInit
  products: ProductDetail[] = [];
  isLoadingProducts = true;

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.ordersService.getOrderWithProducts(this.order.id_order).subscribe({
      next: (response) => {
        console.log('Response completa:', response); // ← Debug
        console.log('Productos:', response.data.products); // ← Debug
        this.products = response.data.products || [];
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoadingProducts = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}