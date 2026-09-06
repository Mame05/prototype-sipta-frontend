import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../../services/order.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation implements OnInit{
  order: OrderResponse | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

console.log('1️⃣ Confirmation chargée');

    const orderId = Number(
      this.route.snapshot.paramMap.get('id')
    );
    console.log('2️⃣ ID commande :', orderId);

    if (!orderId) {
      this.errorMessage =
        'Numéro de commande invalide.';

      this.loading = false;

      return;
    }

    console.log('3️⃣ Appel API pour la commande :', orderId);
    this.loadOrder(orderId);
  }

  loadOrder(id: number): void {
    console.log('4️⃣ loadOrder appelée avec ID :', id);

    this.orderService.getOrder(id).subscribe({

      next: (order) => {
        console.log('5️⃣ Commande reçue :', order);


        this.order = order;
        this.loading = false;

        console.log('6️⃣ order =', this.order);
        console.log('7️⃣ loading =', this.loading);

      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement de la commande :',
          error
        );

        this.errorMessage =
          'Impossible de récupérer les informations de la commande.';

        this.loading = false;

      }

    });

  }

}
