import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css'
})
export class DetailProduit implements OnInit {

  product = signal<Product | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    //private productService: ProductService,
    public productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!productId) {
      this.errorMessage.set('Produit introuvable.');
      this.loading.set(false);
      return;
    }

    this.loadProduct(productId);
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {

        this.product.set(product);
        this.loading.set(false);

        console.log(
          'Produit chargé :',
          product
        );
      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement du produit :',
          error
        );

        this.errorMessage.set(
          'Impossible de récupérer les informations du produit.'
        );

        this.loading.set(false);
      }
    });
  }

  addToCart(): void {

    const product = this.product();

    if (!product) {
      return;
    }

    this.cartService.addToCart(product);

    console.log(
      'Produit ajouté au panier :',
      product.nom
    );
  }
}