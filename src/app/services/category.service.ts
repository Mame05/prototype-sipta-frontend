import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient
  ) {}

  // Récupérer toutes les catégories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.apiUrl
    );
  }

  // Ajouter une catégorie
  createCategory(
    category: {
      nom: string;
      description?: string;
    }
  ): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      category
    );
  }

  // Modifier une catégorie
  updateCategory(
    id: number,
    category: {
      nom: string;
      description?: string;
    }
  ): Observable<Category> {
    return this.http.patch<Category>(
      `${this.apiUrl}/${id}`,
      category
    );
  }

  // Supprimer une catégorie
  deleteCategory(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}