import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalogue',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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
        product.category?.nom === this.selectedCategory;

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

  console.log(
    'Produit ajouté au panier :',
    product.nom
  );

  console.log(
    'Nombre d’articles :',
    this.cartService.getItemCount()
  );

  console.log(
    'Total :',
    this.cartService.getTotal(),
    'FCFA'
  );
}
}
