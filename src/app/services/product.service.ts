import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product';

export interface CreateProductRequest {
  nom: string;
  description?: string;
  prix: number;
  image?: string;
  stock: number;
  disponible?: boolean;
  categoryId: number;
}

export interface UploadImageResponse { 
  message: string; 
  image: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient
  ) {}

  // Récupérer tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiUrl
    );
  }

  // Récupérer un produit
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // Ajouter un produit
  createProduct(
    product: CreateProductRequest
  ): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      product
    );
  }

  // Modifier un produit
  updateProduct(
    id: number,
    product: CreateProductRequest
  ): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  // Supprimer un produit
  deleteProduct(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  // ========================= // UPLOAD IMAGE // ========================= 
  uploadImage( file: File 

  ): Observable<UploadImageResponse> { 
    const formData = new FormData(); 
    formData.append('image', file); 
    return this.http.post<UploadImageResponse>( 
      `${this.apiUrl}/upload`, 
      formData 
    ); 
  }
// créer une URL d'image centralisée
getImageUrl(image: string | null | undefined): string {

  if (!image) {
    return 'assets/images/products/default-product.jpg';
  }

  return `http://localhost:3000/uploads/products/${image}`;
}

}