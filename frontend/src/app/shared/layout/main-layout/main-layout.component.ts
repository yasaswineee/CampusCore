import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import{ AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  userName = '';
  userRole = '';

  constructor(private authservice:AuthService, private router:Router){
    const user=this.authservice.getUser();

    if(user){
      this.userName=user.name;
      this.userRole=user.role;
    }

    
  }

  logOut(){
      this.authService.logOut();
      this.router.navigate(['/login']);
    }
}