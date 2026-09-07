import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  OrderResponse,
  OrderService
} from '../../services/order.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation implements OnInit {

  order = signal<OrderResponse | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

    const orderId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!orderId) {

      this.errorMessage.set(
        'Numéro de commande invalide.'
      );

      this.loading.set(false);

      return;
    }

    this.loadOrder(orderId);
  }

  loadOrder(id: number): void {

    this.orderService.getOrder(id).subscribe({

      next: (order) => {

        this.order.set(order);
        this.loading.set(false);

        console.log(
          'Commande chargée :',
          order
        );

      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement de la commande :',
          error
        );

        this.errorMessage.set(
          'Impossible de récupérer les informations de la commande.'
        );

        this.loading.set(false);
      }

    });
  }
}