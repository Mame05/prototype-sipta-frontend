import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items = signal<CartItem[]>([]);

  readonly itemCount = computed(() =>
    this.items().reduce(
      (count, item) => count + item.quantity,
      0
    )
  );

  readonly total = computed(() =>
    this.items().reduce(
      (total, item) =>
        total + item.product.prix * item.quantity,
      0
    )
  );

  getItems(): CartItem[] {
    return this.items();
  }

  addToCart(product: Product): void {

    const currentItems = this.items();

    const existingItem = currentItems.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      if (existingItem.quantity < product.stock) {

        this.items.set(
          currentItems.map(item =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1
                }
              : item
          )
        );

      }

    } else {

      this.items.set([
        ...currentItems,
        {
          product,
          quantity: 1
        }
      ]);

    }
  }

  increaseQuantity(productId: number): void {

    const currentItems = this.items();

    this.items.set(
      currentItems.map(item => {

        if (
          item.product.id === productId &&
          item.quantity < item.product.stock
        ) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;

      })
    );
  }

  decreaseQuantity(productId: number): void {

    const currentItems = this.items();

    const item = currentItems.find(
      item => item.product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {

      this.items.set(
        currentItems.map(currentItem =>
          currentItem.product.id === productId
            ? {
                ...currentItem,
                quantity: currentItem.quantity - 1
              }
            : currentItem
        )
      );

    } else {

      this.removeFromCart(productId);

    }
  }

  removeFromCart(productId: number): void {

    this.items.set(
      this.items().filter(
        item => item.product.id !== productId
      )
    );

  }

  getTotal(): number {
    return this.total();
  }

  getItemCount(): number {
    return this.itemCount();
  }

  clearCart(): void {
    this.items.set([]);
  }
}