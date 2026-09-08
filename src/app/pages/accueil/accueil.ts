import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

import { Product, Category } from '../../models/product';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  loadingProducts = signal(true);
  loadingCategories = signal(true);

  constructor(
    //private productService: ProductService,
    public productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (data) => {

        this.products.set(data);
        this.loadingProducts.set(false);

        console.log(
          'Produits accueil :',
          data
        );
      },

      error: (error) => {

        console.error(
          'Erreur produits accueil :',
          error
        );

        this.loadingProducts.set(false);
      }

    });
  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (data) => {

        this.categories.set(data);
        this.loadingCategories.set(false);

        console.log(
          'Catégories accueil :',
          data
        );
      },

      error: (error) => {

        console.error(
          'Erreur catégories accueil :',
          error
        );

        this.loadingCategories.set(false);
      }

    });
  }

}