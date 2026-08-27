import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email='';
  password='';

  constructor(private authservice:AuthService, private router:Router){}

  login(){
    if(this.email===''||this.password===''){
      swal.fire({
        icon:'warning',
        title:'Missing Information',
        text:'Please enter your email and password'
      });

      return;
    }

    this.authService.login(this.email,this.password).subscribe({
      next:response=>{
        this.authService.saveLoginData(response);

        swal.fire({
          icon:'success',
          title:'Login Successful',
          text:'Welcome to CampusCore',
          timer:1500,
          showConfirmButton:false
        });

        if(response.user.role==="admin"){
          this.router.navigate(['/admin/dashboard']);
        }

        if(response.user.role==='hod'){
          this.router.navigate(['/hod/dashboard']);
        }

        if(response.user.role==='faculty'){
          this.router.navigate(['/faculty/dashboard']);
        }

        if(response.user.role==='student'){
          this.router.navigate(['/student/dashboard']);
        }
      },

      error: (error)=>{
        swal.fire({
          icon:'error',
          title:'Login Failed',
          text:error.error?.message|| "Invalid email or password"
        });
      }
    });
  }

}
