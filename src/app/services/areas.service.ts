// src/app/services/areas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto'; // Asumo ResponseDto
import { Area } from '../core/models/area.model'; // Tu modelo Area

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private readonly API_URL = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) {}

  getAllForForms(): Observable<ResponseDto<Area[]>> {
    return this.http.get<ResponseDto<Area[]>>(`${this.API_URL}`);
  }

  getById(id: number): Observable<ResponseDto<Area>> {
    return this.http.get<ResponseDto<Area>>(`${this.API_URL}/${id}`);
  }
  
}