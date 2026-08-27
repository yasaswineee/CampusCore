import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: string) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();

  if (role === allowedRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};