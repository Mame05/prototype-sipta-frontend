import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  CartItem,
  CartService
} from '../../services/cart.service';

import {
  OrderService
} from '../../services/order.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './commande.html',
  styleUrl: './commande.css'
})
export class Commande implements OnInit {

  items = signal<CartItem[]>([]);
  total = signal(0);

  isSubmitting = signal(false);
  errorMessage = signal('');

  commandeForm: any;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.commandeForm = this.fb.group({

      nomClient: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],

      telephone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      adresse: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]

    });
  }

  ngOnInit(): void {

    this.items.set(
      this.cartService.getItems()
    );

    this.total.set(
      this.cartService.getTotal()
    );

  }

  submitOrder(): void {

    if (this.commandeForm.invalid) {

      this.commandeForm.markAllAsTouched();

      return;
    }

    if (this.items().length === 0) {

      this.errorMessage.set(
        'Votre panier est vide. Ajoutez au moins un produit.'
      );

      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const order = {

      nomClient: this.commandeForm.value.nomClient!,
      telephone: this.commandeForm.value.telephone!,
      email: this.commandeForm.value.email!,
      adresse: this.commandeForm.value.adresse!,

      items: this.items().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))

    };

    console.log(
      'Commande envoyée :',
      order
    );

    this.orderService.createOrder(order).subscribe({

      next: (response) => {

        console.log(
          'Commande créée avec succès :',
          response
        );

        this.cartService.clearCart();

        this.isSubmitting.set(false);

        this.router.navigate([
          '/confirmation',
          response.id
        ]);

      },

      error: (error) => {

        console.error(
          'Erreur lors de la commande :',
          error
        );

        this.isSubmitting.set(false);

        this.errorMessage.set(
          error?.error?.message ||
          'Une erreur est survenue lors de la commande.'
        );

      }

    });
  }
}