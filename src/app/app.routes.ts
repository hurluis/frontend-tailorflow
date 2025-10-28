import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Employee } from './pages/employee/employee';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
    {
        path: '', 
        component: Login
    },
    {
        path: 'admin', 
        component: Admin, 
        canActivate:[authGuard, roleGuard],
        data: {role: 'admin'}
    },
    {
        path: 'employee', 
        component: Employee, 
        canActivate:[authGuard, roleGuard],
        data: {role: 'employee'}
    }
];
