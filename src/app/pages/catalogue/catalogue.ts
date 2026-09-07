import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-catalogue',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  searchTerm = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
     this.loadCategories();
  }

  loadCategories(): void {

  this.categoryService.getCategories().subscribe({

    next: (data) => {
      this.categories = data;

      console.log('Catégories reçues :', data);
    },

    error: (error) => {
      console.error(
        'Erreur lors du chargement des catégories :',
        error
      );
    }

  });
}

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    });
  }

  filterProducts(): void {
    const search = this.searchTerm.toLowerCase().trim();

    this.filteredProducts = this.products.filter(product => {

      const matchesSearch =
        product.nom.toLowerCase().includes(search);

      const matchesCategory =
        !this.selectedCategory ||
        product.category.nom === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearch(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  addToCart(product: Product): void {
  this.cartService.addToCart(product);

  console.log('PRODUIT AJOUTÉ :', product.nom);
}
}
