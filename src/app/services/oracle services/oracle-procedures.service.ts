import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto } from '../../core/models/response.dto';
import { OrderTracking } from '../../core/models oracle/order-tracking.model';
import { ProductLocation } from '../../core/models oracle/product-location.model';
@Injectable({
  providedIn: 'root'
})
export class OracleProceduresService {
  private readonly API_URL = `${environment.apiUrl}/oracle-procedures`;

  constructor(private http: HttpClient) {}

  getOrderTracking(orderId: number): Observable<ResponseDto<OrderTracking[]>> {
    return this.http.get<ResponseDto<OrderTracking[]>>(`${this.API_URL}/order-tracking/${orderId}`);
  }

  getProductLocation(productId: number): Observable<ResponseDto<ProductLocation[]>> {
    return this.http.get<ResponseDto<ProductLocation[]>>(`${this.API_URL}/product-location/${productId}`);
  }
}