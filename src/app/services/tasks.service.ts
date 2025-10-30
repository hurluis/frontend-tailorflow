import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Task } from '../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  startTask(taskId: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${taskId}/start`, {});
  }

  completeTask(taskId: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${taskId}/complete`, {});
  }
}
