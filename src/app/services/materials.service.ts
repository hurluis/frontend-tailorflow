import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Material } from '../core/models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  private readonly API_URL = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<Material[]>> {
    return this.http.get<ResponseDto<Material[]>>(this.API_URL);
  }

  getById(id: number): Observable<ResponseDto<Material>> {
    return this.http.get<ResponseDto<Material>>(`${this.API_URL}/${id}`);
  }

  create(material: any): Observable<ResponseDto<Material>> {
    return this.http.post<ResponseDto<Material>>(this.API_URL, material);
  }

  update(id: number, material: any): Observable<ResponseDto<Material>> {
    return this.http.patch<ResponseDto<Material>>(`${this.API_URL}/${id}`, material);
  }

  delete(id: number): Observable<ResponseDto<Material>> {
    return this.http.delete<ResponseDto<Material>>(`${this.API_URL}/${id}`);
  }

  checkStock(materials: {id_material: number, quantity: number}[]): Observable<ResponseDto<any>> {
    return this.http.post<ResponseDto<any>>(`${this.API_URL}/check-stock`, { materials });
  }
}