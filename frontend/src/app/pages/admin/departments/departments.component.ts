import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit {

  departments: any[]=[];
  search='';
  currentPage=1;
  totalPages=1;
  totalItems=0;
  limit=10;

  showForm=false;
  isEdit=false;

  departmentId='';
  departmentName='';
  departmentCode='';

  constructor(private departmentService:departmentService){}

  ngOnInit(){
    this.loadDepartments();

    loadDepartments(){
      this.departmentService.getDepartments(this.currentPage,this.limit,this.search).
      subscribe({
        next: (response)=>{
          this.departments=response.departments;
          this.currentPage=response.pagination.currentPage;
          this.totalPages=response.pagination.totalPages;
          this.limit=response.pagination.limit;
       },

      error:(error)=>{
        swal.fire({
          icon:'error',
          title:"Error",
          text:error.error?.message|| 'Unable to load departments'
        });

      }
    
    });
  }

  searchDepartments(){
    this.currentPage=1;
    this.loadDepartments();
  }

  openAddForm(){
    this.isEdit=false;

    this.departmentId:'';
    this.departmentName:'';
    this.departmentCode:'';

    this.showForm=true;
  }

  openEditForm(department:any){
    this.isEdit=true;
    this.departmentId=department._id;
    this.departmentName=department.name;
    this.departmentCode=department.code;
    this.showForm=true;
  }

  closeForm{
    this.showForm=false;
  }

  saveDepartment(){
    if(
      this.departmentName.trim===''||
      this.departmentCode.trim===''
    ){
      swal.fire({
        icon:'warning',
        title:'Missing fields',
        text:'Please enter department name and code'
      });
      return;
    }
    const data={
      name=this.department.Name,
      code=this.department.Code
    };

    if(this.isEdit){
      this.departmentService.updateDepartment(this.departmentId,data).subscribe({
        next:response=>{
          swal.fire({
            icon:'success',
            title:'Updated',
            text:response.message,
            timer:1500,
            showConfirmButton:false
          });

          this.closeForm();
          this.loadDepartments();
        },

        error:(error)=>{
         Swal.fire({
              icon: 'error',
              title: 'Update failed',
              text: error.error?.message || 'Unable to update department'
          });
        }
      });
    }
    else{
      this.departmentService.createDepartment(data).subscribe({
        next: (response)=>{
          swal.fire({
            icon:'Success',
            title:'Created',
            text:response.message,
            timer:1500,
            showConfirmButton:false
          });
          this.closeForm();
          this.loadDepartments();
        },
        error:(error)=>{
          swal.fire({
            icon:'error',
            title:'Creation failed',
            text:error.error?.message||'Unable to create department'
          });
        }
      });
    }
  }
  deleteDepartment(id:string){
     Swal.fire({
      title: 'Delete Department?',
      text: 'This department will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        this.departmentService
          .deleteDepartment(id)
          .subscribe({

            next: (response) => {

              Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: response.message,
                timer: 1500,
                showConfirmButton: false
              });

              this.loadDepartments();
            },

            error: (error) => {

              Swal.fire({
                icon: 'error',
                title: 'Delete failed',
                text: error.error?.message || 'Unable to delete department'
              });

            }

          });

      }

    });
    
  }
  previousPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadDepartments();
    }
  }
   nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.loadDepartments();
    }
  }
  exportToExcel() {

    const data = this.departments.map((department) => {

      return {
        Name: department.name,
        Code: department.code,
        HOD: department.hod
          ? department.hod.name
          : 'Not Assigned'
      };

    });
     const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Departments'
    );

    XLSX.writeFile(
      workbook,
      'departments.xlsx'
    );
  }
}
}
