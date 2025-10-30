import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';


interface MenuItem {
  label: string;
  icon: string;
  route: string;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {

  menuItems: MenuItem[] = [

    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },

    { label: 'Pedidos', icon: 'shopping_cart', route: '/admin/orders' },

    { label: 'Clientes', icon: 'people', route: '/admin/customers' },

    { label: 'Empleados', icon: 'badge', route: '/admin/employees' },

    { label: 'Roles', icon: 'admin_panel_settings', route: '/admin/roles' },

    { label: 'Áreas', icon: 'location_city', route: '/admin/areas' },

    { label: 'Categorías', icon: 'category', route: '/admin/categories' },

    { label: 'Materiales', icon: 'inventory', route: '/admin/materials' },

    { label: 'Flujos', icon: 'account_tree', route: '/admin/flows' },

    { label: 'Seguimiento de orden', icon: 'track_changes', route: '/admin/order-tracking' },

    { label: 'Ubicación Productos', icon: 'place', route: '/admin/product-location' }

  ];

}

