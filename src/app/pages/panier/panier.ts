import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panier.html',
  styleUrl: './panier.css',
})
export class Panier implements OnInit  {
  items: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    console.log('==============================');
  console.log('PANIER À L’OUVERTURE :', this.cartService.getItems());
  console.log('NOMBRE :', this.cartService.getItemCount());
  console.log('==============================');
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
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
