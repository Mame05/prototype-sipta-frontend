import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

import { Product, Category } from '../../../models/product';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './produits.html',
  styleUrl: './produits.css'
})
export class Produits implements OnInit {

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  loading = signal(true);
  showForm = signal(false);
  isEdit = signal(false);

  selectedId = signal<number | null>(null);

  successMessage = signal('');
  errorMessage = signal('');

  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(1000)
        ]
      ],

      prix: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      image: [
        '',
        [
          Validators.maxLength(255)
        ]
      ],

      stock: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      disponible: [
        true
      ],

      categoryId: [
        null,
        [
          Validators.required
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {

    this.loading.set(true);

    this.productService.getProducts().subscribe({
      next: (data) => {

        this.products.set(data);
        this.loading.set(false);

        console.log('Produits admin :', data);
      },

      error: (error) => {

        console.error('Erreur produits :', error);

        this.errorMessage.set(
          'Impossible de récupérer les produits.'
        );

        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({
      next: (data) => {

        this.categories.set(data);

        console.log(
          'Catégories produits :',
          data
        );
      },

      error: (error) => {

        console.error(
          'Erreur catégories :',
          error
        );

        this.errorMessage.set(
          'Impossible de récupérer les catégories.'
        );
      }
    });
  }

  openAdd(): void {

    this.isEdit.set(false);
    this.selectedId.set(null);

    this.productForm.reset({
      nom: '',
      description: '',
      prix: 0,
      image: '',
      stock: 0,
      disponible: true,
      categoryId: null
    });

    this.successMessage.set('');
    this.errorMessage.set('');

    this.showForm.set(true);
  }

  openEdit(product: Product): void {

    this.isEdit.set(true);
    this.selectedId.set(product.id);

    this.productForm.patchValue({
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      image: product.image,
      stock: product.stock,
      disponible: product.disponible,
      categoryId: product.categoryId
    });

    this.successMessage.set('');
    this.errorMessage.set('');

    this.showForm.set(true);
  }

  closeForm(): void {

    this.showForm.set(false);

    this.productForm.reset();

    this.selectedId.set(null);

    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;
    }

    const data = {
      nom: this.productForm.value.nom,
      description: this.productForm.value.description || '',
      prix: Number(this.productForm.value.prix),
      image: this.productForm.value.image || '',
      stock: Number(this.productForm.value.stock),
      disponible: this.productForm.value.disponible,
      categoryId: Number(this.productForm.value.categoryId)
    };

    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.isEdit()) {

      const id = this.selectedId();

      if (!id) return;

      this.productService
        .updateProduct(id, data)
        .subscribe({

          next: () => {

            this.successMessage.set(
              'Produit modifié avec succès.'
            );

            this.showForm.set(false);

            this.loadProducts();
          },

          error: (error) => {

            console.error(
              'Erreur modification produit :',
              error
            );

            this.errorMessage.set(
              error?.error?.message ||
              'Impossible de modifier le produit.'
            );
          }
        });

    } else {

      this.productService
        .createProduct(data)
        .subscribe({

          next: () => {

            this.successMessage.set(
              'Produit ajouté avec succès.'
            );

            this.showForm.set(false);

            this.loadProducts();
          },

          error: (error) => {

            console.error(
              'Erreur ajout produit :',
              error
            );

            this.errorMessage.set(
              error?.error?.message ||
              'Impossible d’ajouter le produit.'
            );
          }
        });
    }
  }

  deleteProduct(product: Product): void {

    const confirmed = confirm(
      `Voulez-vous vraiment supprimer le produit "${product.nom}" ?`
    );

    if (!confirmed) return;

    this.successMessage.set('');
    this.errorMessage.set('');

    this.productService
      .deleteProduct(product.id)
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Produit supprimé avec succès.'
          );

          this.loadProducts();
        },

        error: (error) => {

          console.error(
            'Erreur suppression produit :',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Impossible de supprimer le produit.'
          );
        }
      });
  }
}