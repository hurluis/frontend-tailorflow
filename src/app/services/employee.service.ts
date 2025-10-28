import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../core/models/response.dto';
import { Employee } from '../core/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient){}

    getEmployeeDetails(cc: string): Observable<ResponseDto<Employee>>{
      return this.http.get<ResponseDto<Employee>>(`${this.apiUrl}/employees/cc/${cc}`);
    }

}
