import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Employee } from './pages/employee/employee';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { OrdersList } from './pages/admin/orders/orders-list/orders-list';
import { CreateOrder } from './pages/admin/orders/create-order/create-order';
import { EditOrder } from './pages/admin/orders/edit-order/edit-order';
import { CustomersList } from './pages/admin/customers/customers-list/customers-list';
import { CreateCustomer } from './pages/admin/customers/create-customer/create-customer';
import { EmployeesList } from './pages/admin/employees/employees-list/employees-list';
import { CreateEmployee } from './pages/admin/employees/create-employee/create-employee';
import { EditEmployee} from './pages/admin/employees/edit-employee/edit-employee';
import { EditCustomer } from './pages/admin/customers/edit-customer/edit-customer';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'orders', component: OrdersList },
            { path: 'orders/create', component: CreateOrder },
            { path: 'orders/edit/:id', component: EditOrder },
            { path: 'customers', component: CustomersList },
            { path: 'customers/create', component: CreateCustomer },
            { path: 'customers/edit/:id', component: EditCustomer },
            { path: 'employees', component: EmployeesList },
            { path: 'employees/create', component: CreateEmployee},
            { path: 'employees/edit/:id', component: EditEmployee }
        ]
    },
    {
        path: 'employee',
        component: Employee,
        canActivate: [authGuard, roleGuard],
        data: { role: 'employee' }
    }
];
