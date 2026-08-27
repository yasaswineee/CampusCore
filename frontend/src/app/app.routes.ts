import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { HodDashboardComponent } from './pages/hod/dashboard/dashboard.component';
import { FacultyDashboardComponent } from './pages/faculty/dashboard/dashboard.component';
import { StudentDashboardComponent } from './pages/student/dashboard/dashboard.component';
import { DepartmentsComponent } from './pages/admin/departments/departments.component';
import { SubjectsComponent } from './pages/admin/subjects/subjects.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [
      authGuard,
      () => roleGuard('admin')
    ],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
      path: 'departments',
      component: DepartmentsComponent
      }
      {
      path: 'subjects',
      component: SubjectsComponent
      }
    ]
  },

  {
    path: 'hod',
    component: MainLayoutComponent,
    canActivate: [
      authGuard,
      () => roleGuard('hod')
    ],
    children: [
      {
        path: 'dashboard',
        component: HodDashboardComponent
      }
    ]
  },

  {
    path: 'faculty',
    component: MainLayoutComponent,
    canActivate: [
      authGuard,
      () => roleGuard('faculty')
    ],
    children: [
      {
        path: 'dashboard',
        component: FacultyDashboardComponent
      }
    ]
  },

  {
    path: 'student',
    component: MainLayoutComponent,
    canActivate: [
      authGuard,
      () => roleGuard('student')
    ],
    children: [
      {
        path: 'dashboard',
        component: StudentDashboardComponent
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];