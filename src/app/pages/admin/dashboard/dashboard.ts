import { Component, OnInit, signal } from '@angular/core';
import { OrderResponse, OrderService } from '../../../services/order.service';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { Category, Product } from '../../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
   products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  orders = signal<OrderResponse[]>([]);

  loading = signal(true);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.checkLoading();
      },
      error: (error) => {
        console.error(
          'Erreur produits :',
          error
        );
        this.checkLoading();
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.checkLoading();
      },
      error: (error) => {
        console.error(
          'Erreur catégories :',
          error
        );
        this.checkLoading();
      }
    });

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.checkLoading();
      },
      error: (error) => {
        console.error(
          'Erreur commandes :',
          error
        );
        this.checkLoading();
      }
    });
  }

  private checkLoading(): void {
    if (
      this.products().length >= 0 &&
      this.categories().length >= 0 &&
      this.orders().length >= 0
    ) {
      this.loading.set(false);
    }
  }

  get totalProducts(): number {
    return this.products().length;
  }

  get totalCategories(): number {
    return this.categories().length;
  }

  get totalOrders(): number {
    return this.orders().length;
  }

  get totalSales(): number {
    return this.orders()
      .filter(order => order.statut !== 'annulee')
      .reduce(
        (total, order) => total + order.total,
        0
      );
  }

  get recentOrders(): OrderResponse[] {
    return [...this.orders()]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }

}
