import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OrdersService } from '../../../../services/orders.service';
import { Order } from '../../../../core/models/order.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderDetailsDialog } from '../order-details-dialog/order-details-dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss'
})
export class OrdersList implements OnInit {
  orders: Order[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  displayedColumns: string[] = ['id_order', 'customer_name', 'entry_date', 'estimated_delivery_date', 'state_name', 'actions'];
  isLoading = false;

  constructor(private ordersService: OrdersService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getAll(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.orders = response.data.orders;
        this.total = response.data.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos', err);
        this.isLoading = false;
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.dialog.open(OrderDetailsDialog, {
      width: '800px',
      maxHeight: '90vh',
      data: order
    });
  }

  editOrder(order: Order): void {
    
    if (order.state_name !== 'PENDING') {
      alert('Solo se pueden editar pedidos en estado PENDIENTE');
      return;
    }
    this.router.navigate(['/admin/orders/edit', order.id_order]);
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }
}
