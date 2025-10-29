import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Employee } from './pages/employee/employee';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { OrdersList } from './pages/admin/orders/orders-list/orders-list';
import { CreateOrder} from './pages/admin/orders/create-order/create-order';
import { EditOrder } from './pages/admin/orders/edit-order/edit-order';

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
           { path: 'orders/edit/:id', component: EditOrder}
        ]
    },
    {
        path: 'employee',
        component: Employee,
        canActivate: [authGuard, roleGuard],
        data: { role: 'employee' }
    }
];
