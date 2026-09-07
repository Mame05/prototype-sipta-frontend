import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  CartItem,
  CartService
} from '../../services/cart.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './panier.html',
  styleUrl: './panier.css'
})
export class Panier implements OnInit {

  items = signal<CartItem[]>([]);
  total = signal(0);

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    console.log(
      'PANIER À L’OUVERTURE :',
      this.cartService.getItems()
    );

    console.log(
      'NOMBRE :',
      this.cartService.getItemCount()
    );

    this.loadCart();
  }

  loadCart(): void {

    this.items.set(
      this.cartService.getItems()
    );

    this.total.set(
      this.cartService.getTotal()
    );
  }

  increaseQuantity(productId: number): void {

    this.cartService.increaseQuantity(productId);

    this.loadCart();
  }

  decreaseQuantity(productId: number): void {

    this.cartService.decreaseQuantity(productId);

    this.loadCart();
  }

  removeItem(productId: number): void {

    this.cartService.removeFromCart(productId);

    this.loadCart();
  }

  clearCart(): void {

    this.cartService.clearCart();

    this.loadCart();
  }
}