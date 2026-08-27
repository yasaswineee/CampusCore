import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private apiUrl = 'http://localhost:5000/api/subjects';

  constructor(private http: HttpClient) {}

  getSubjects(page: number, limit: number, search: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
  }

  createSubject(data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      this.apiUrl,
      data,
      { headers }
    );
  }

  updateSubject(id: string, data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      data,
      { headers }
    );
  }

  deleteSubject(id: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      { headers }
    );
  }
}