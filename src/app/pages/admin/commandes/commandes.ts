import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  OrderService,
  OrderResponse
} from '../../../services/order.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css'
})
export class Commandes implements OnInit {

  orders = signal<OrderResponse[]>([]);

  loading = signal(true);

  successMessage = signal('');
  errorMessage = signal('');

  // Commande sélectionnée pour afficher son détail
  selectedOrder = signal<OrderResponse | null>(null);

  // Chargement du détail
  loadingDetail = signal(false);

  selectedStatus = signal('');
  updatingStatus = signal(false);

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading.set(true);

    this.orderService.getOrders().subscribe({

      next: (data) => {

        this.orders.set(data);

        this.loading.set(false);

        console.log(
          'Commandes admin :',
          data
        );
      },

      error: (error) => {

        console.error(
          'Erreur commandes :',
          error
        );

        this.errorMessage.set(
          'Impossible de récupérer les commandes.'
        );

        this.loading.set(false);
      }

    });
  }

  /**
   * Nombre total d'articles d'une commande
   */
  getItemCount(order: OrderResponse): number {

    if (!order.items) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }

  /**
   * Ouvre le détail d'une commande
   */
viewOrder(order: OrderResponse): void {

  this.loadingDetail.set(true);

  this.errorMessage.set('');

  this.orderService.getOrder(order.id).subscribe({

    next: (data) => {

      this.selectedOrder.set(data);

      this.selectedStatus.set(data.statut);

      this.loadingDetail.set(false);

      console.log(
        'Détail commande :',
        data
      );
    },

    error: (error) => {

      console.error(
        'Erreur détail commande :',
        error
      );

      this.loadingDetail.set(false);

      this.errorMessage.set(
        'Impossible de récupérer le détail de la commande.'
      );
    }

  });
}



  /**
   * Ferme le détail de la commande
   */
  closeOrder(): void {

    this.selectedOrder.set(null);

  }
/**
 * Prépare la modification du statut
 */
prepareStatusChange(): void {

  const order = this.selectedOrder();

  if (!order) {
    return;
  }

  this.selectedStatus.set(order.statut);
}


/**
 * Modifie le statut de la commande
 */
updateStatus(): void {

  const order = this.selectedOrder();

  if (!order) {
    return;
  }

  const newStatus = this.selectedStatus();

  if (!newStatus) {
    return;
  }

  // Aucun changement
  if (newStatus === order.statut) {
    return;
  }

  this.updatingStatus.set(true);

  this.errorMessage.set('');
  this.successMessage.set('');

  this.orderService.updateStatus(
    order.id,
    newStatus
  ).subscribe({

    next: (updatedOrder) => {

      // Mise à jour de la commande dans la modale
      this.selectedOrder.set(updatedOrder);

      // Mise à jour de la commande dans la liste
      this.orders.update(
        orders =>
          orders.map(item =>
            item.id === updatedOrder.id
              ? updatedOrder
              : item
          )
      );

      this.updatingStatus.set(false);

      this.successMessage.set(
        `Le statut de la commande #${updatedOrder.id} a été mis à jour.`
      );

      console.log(
        'Commande mise à jour :',
        updatedOrder
      );

    },

    error: (error) => {

      console.error(
        'Erreur modification statut :',
        error
      );

      this.updatingStatus.set(false);

      this.errorMessage.set(
        'Impossible de modifier le statut de la commande.'
      );

    }

  });
}


}

