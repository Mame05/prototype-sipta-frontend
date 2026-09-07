import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css',
})
export class DetailProduit implements OnInit{
   product: Product | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    const productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!productId) {
      this.errorMessage = 'Produit introuvable.';
      this.loading = false;
      return;
    }

    this.loadProduct(productId);
  }

  loadProduct(id: number): void {

    this.productService.getProduct(id).subscribe({

      next: (product) => {
        this.product = product;
        this.loading = false;

        console.log('Produit chargé :', product);
      },

      error: (error) => {
        console.error(
          'Erreur lors du chargement du produit :',
          error
        );

        this.errorMessage =
          'Impossible de récupérer les informations du produit.';

        this.loading = false;
      }

    });
  }

  addToCart(): void {

    if (!this.product) {
      return;
    }

    this.cartService.addToCart(this.product);

    console.log(
      'Produit ajouté au panier :',
      this.product.nom
    );
  }
}
