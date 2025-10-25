import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'admin', component: Admin}
];
