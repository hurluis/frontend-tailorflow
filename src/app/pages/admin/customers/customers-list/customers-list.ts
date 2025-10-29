import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CustomersService } from '../../../../services/customers.service';
import { Customer } from '../../../../core/models/customer.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss'
})
export class CustomersList implements OnInit {
  customers: Customer[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  displayedColumns: string[] = ['id_customer', 'name', 'phone', 'address', 'actions'];
  isLoading = false;

  constructor(private customersService: CustomersService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customersService.getAll(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.customers = response.data.customers;
        this.total = response.data.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCustomers();
  }
}