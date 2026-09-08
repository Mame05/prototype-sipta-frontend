
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderProduct {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  stock: number;
  disponible: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  id: number;
  quantity: number;
  prixUnitaire: number;
  sousTotal: number;
  orderId: number;
  productId: number;
  product: OrderProduct;
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
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(
    private http: HttpClient
  ) {}

  createOrder(
    order: CreateOrderRequest
  ): Observable<OrderResponse> {

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
  updateStatus(
    id: number,
    statut: string
  ): Observable<OrderResponse> {

    return this.http.patch<OrderResponse>(
      `${this.apiUrl}/${id}/status`,
      {
        statut
      }
    );
  }

}

