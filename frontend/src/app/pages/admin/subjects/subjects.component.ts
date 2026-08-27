import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../../core/services/subject.service';
import { DepartmentService } from '../../../core/services/department.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit {

  subjects: any[] = [];
  departments: any[] = [];

  search = '';

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  limit = 10;

  showForm = false;
  isEdit = false;

  subjectId = '';

  subjectName = '';
  subjectCode = '';

  selectedDepartments: string[] = [];

  constructor(
    private subjectService: SubjectService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {

    this.loadSubjects();
    this.loadDepartments();

  }

  loadSubjects() {

    this.subjectService
      .getSubjects(this.currentPage, this.limit, this.search)
      .subscribe({

        next: (response) => {

          this.subjects = response.subjects;

          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.totalItems;
          this.limit = response.pagination.limit;

        },

        error: (error) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Unable to load subjects'
          });

        }

      });

  }

  loadDepartments() {

    this.departmentService
      .getDepartments(1, 100, '')
      .subscribe({

        next: (response) => {

          this.departments = response.departments;

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

  searchSubjects() {

    this.currentPage = 1;

    this.loadSubjects();

  }

  openAddForm() {

    this.isEdit = false;

    this.subjectId = '';
    this.subjectName = '';
    this.subjectCode = '';
    this.selectedDepartments = [];

    this.showForm = true;

  }

  openEditForm(subject: any) {

    this.isEdit = true;

    this.subjectId = subject._id;
    this.subjectName = subject.name;
    this.subjectCode = subject.code;

    this.selectedDepartments = subject.departments
      ? subject.departments.map((department: any) => department._id)
      : [];

    this.showForm = true;

  }

  closeForm() {

    this.showForm = false;

  }

  saveSubject() {

    if (
      this.subjectName.trim() === '' ||
      this.subjectCode.trim() === ''
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please enter subject name and code'
      });

      return;

    }

    if (this.selectedDepartments.length === 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Department required',
        text: 'Please select at least one department'
      });

      return;

    }

    const data = {

      name: this.subjectName,
      code: this.subjectCode,
      departments: this.selectedDepartments

    };


    if (this.isEdit) {

      this.subjectService
        .updateSubject(this.subjectId, data)
        .subscribe({

          next: (response) => {

            Swal.fire({
              icon: 'success',
              title: 'Updated',
              text: response.message,
              timer: 1500,
              showConfirmButton: false
            });

            this.closeForm();
            this.loadSubjects();

          },

          error: (error) => {

            Swal.fire({
              icon: 'error',
              title: 'Update failed',
              text: error.error?.message || 'Unable to update subject'
            });

          }

        });

    } else {

      this.subjectService
        .createSubject(data)
        .subscribe({

          next: (response) => {

            Swal.fire({
              icon: 'success',
              title: 'Created',
              text: response.message,
              timer: 1500,
              showConfirmButton: false
            });

            this.closeForm();
            this.loadSubjects();

          },

          error: (error) => {

            Swal.fire({
              icon: 'error',
              title: 'Creation failed',
              text: error.error?.message || 'Unable to create subject'
            });

          }

        });

    }

  }

  deleteSubject(id: string) {

    Swal.fire({

      title: 'Delete Subject?',
      text: 'This subject will be deleted.',
      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.isConfirmed) {

        this.subjectService
          .deleteSubject(id)
          .subscribe({

            next: (response) => {

              Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: response.message,
                timer: 1500,
                showConfirmButton: false
              });

              this.loadSubjects();

            },

            error: (error) => {

              Swal.fire({
                icon: 'error',
                title: 'Delete failed',
                text: error.error?.message || 'Unable to delete subject'
              });

            }

          });

      }

    });

  }

  previousPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadSubjects();

    }

  }

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.loadSubjects();

    }

  }

  exportToExcel() {

    const data = this.subjects.map((subject) => {

      return {

        Name: subject.name,

        Code: subject.code,

        Departments: subject.departments
          ? subject.departments
              .map((department: any) => department.name)
              .join(', ')
          : 'Not Assigned'

      };

    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Subjects'
    );

    XLSX.writeFile(
      workbook,
      'subjects.xlsx'
    );

  }

}