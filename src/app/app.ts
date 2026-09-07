import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { Product } from './models/product';
import { CommonModule } from '@angular/common';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
   products: Product[] = [];

  constructor(
    private productService: ProductService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Produits reçus :', data);
      },
      error: (error) => {
        console.error('Erreur API :', error);
      }
    });
  }
   isAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
