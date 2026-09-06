import { Injectable } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'sipta_cart';

  private items: CartItem[] = [];

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {

    const storedCart = localStorage.getItem(this.storageKey);

    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }

  }

  private saveCart(): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.items)
    );

  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(product: Product): void {

    const existingItem = this.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }

    } else {

      this.items.push({
        product: product,
        quantity: 1
      });

    }

    this.saveCart();
  }

  increaseQuantity(productId: number): void {

    const item = this.items.find(
      item => item.product.id === productId
    );

    if (item && item.quantity < item.product.stock) {
      item.quantity++;
      this.saveCart();
    }
  }

  decreaseQuantity(productId: number): void {

    const item = this.items.find(
      item => item.product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {

      item.quantity--;

    } else {

      this.items = this.items.filter(
        item => item.product.id !== productId
      );

    }

    this.saveCart();
  }

  removeFromCart(productId: number): void {

    this.items = this.items.filter(
      item => item.product.id !== productId
    );

    this.saveCart();
  }

  getTotal(): number {

    return this.items.reduce(
      (total, item) =>
        total + item.product.prix * item.quantity,
      0
    );

  }

  getItemCount(): number {

    return this.items.reduce(
      (count, item) => count + item.quantity,
      0
    );

  }

  clearCart(): void {

    this.items = [];

    localStorage.removeItem(this.storageKey);
  }
}