import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  nomClient: string;
  telephone: string;
  email: string;
  adresse: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  id: number;
  nomClient: string;
  telephone: string;
  email: string;
  adresse: string;
  total: number;
  statut: string;
  items: any[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(
    private http: HttpClient
  ) {}

  createOrder(order: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.apiUrl,
      order
    );
  }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(
      this.apiUrl
    );
  }

  getOrder(id: number): Observable<OrderResponse> {
  return this.http.get<OrderResponse>(
    `${this.apiUrl}/${id}`
  );
}
}