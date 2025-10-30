import { MenuItem } from "../core/models/menu-item.model";

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
  { label: 'Pedidos', icon: 'shopping_cart', route: '/admin/orders' },
  { label: 'Clientes', icon: 'people', route: '/admin/customers' },
  { label: 'Empleados', icon: 'badge', route: '/admin/employees' },
  { label: 'Roles', icon: 'admin_panel_settings', route: '/admin/roles' },
  { label: 'Áreas', icon: 'location_city', route: '/admin/areas' },
  { label: 'Categorías', icon: 'category', route: '/admin/categories' },
  { label: 'Materiales', icon: 'inventory', route: '/admin/materials' },
  { label: 'Flujos', icon: 'account_tree', route: '/admin/flows' },
  { label: 'Seguimiento Pedidos', icon: 'track_changes', route: '/admin/order-tracking' },
  { label: 'Ubicación Productos', icon: 'place', route: '/admin/product-location' }
];

export const EMPLOYEE_MENU_ITEMS: MenuItem[] = [
  { label: 'Mi perfil', icon: 'person', route: '/employee/profile' },
  { label: 'Tareas Asignadas', icon: 'assignment', route: '/employee/tasks' },
  { label: 'Tareas Completadas', icon: 'check', route: '/employee/completed-tasks' },
  
  
];