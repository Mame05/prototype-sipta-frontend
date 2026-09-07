import { Component, OnInit, signal } from '@angular/core';
import { Category } from '../../../models/product';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories = signal<Category[]>([]);

  loading = signal(true);

  showForm = signal(false);

  isEdit = signal(false);

  selectedId = signal<number | null>(null);

  successMessage = signal('');

  errorMessage = signal('');

  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.loading.set(true);

    this.categoryService.getCategories().subscribe({

      next: (data) => {

        this.categories.set(data);

        this.loading.set(false);

        console.log(
          'Catégories admin :',
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

        this.loading.set(false);
      }

    });
  }

  openAdd(): void {

    this.isEdit.set(false);

    this.selectedId.set(null);

    this.categoryForm.reset();

    this.successMessage.set('');

    this.errorMessage.set('');

    this.showForm.set(true);
  }

  openEdit(category: Category): void {

    this.isEdit.set(true);

    this.selectedId.set(category.id);

    this.categoryForm.patchValue({
      nom: category.nom,
      description: category.description
    });

    this.successMessage.set('');

    this.errorMessage.set('');

    this.showForm.set(true);
  }

  closeForm(): void {

    this.showForm.set(false);

    this.categoryForm.reset();

    this.selectedId.set(null);

    this.successMessage.set('');

    this.errorMessage.set('');
  }

  saveCategory(): void {

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    const data = {
      nom: this.categoryForm.value.nom,
      description:
        this.categoryForm.value.description || ''
    };

    this.errorMessage.set('');

    if (this.isEdit()) {

      const id = this.selectedId();

      if (!id) {
        return;
      }

      this.categoryService
        .updateCategory(id, data)
        .subscribe({

          next: () => {

            this.successMessage.set(
              'Catégorie modifiée avec succès.'
            );

            this.showForm.set(false);

            this.loadCategories();
          },

          error: (error) => {

            console.error(
              'Erreur modification catégorie :',
              error
            );

            this.errorMessage.set(
              error?.error?.message ||
              'Impossible de modifier la catégorie.'
            );
          }

        });

    } else {

      this.categoryService
        .createCategory(data)
        .subscribe({

          next: () => {

            this.successMessage.set(
              'Catégorie ajoutée avec succès.'
            );

            this.showForm.set(false);

            this.loadCategories();
          },

          error: (error) => {

            console.error(
              'Erreur ajout catégorie :',
              error
            );

            this.errorMessage.set(
              error?.error?.message ||
              'Impossible d’ajouter la catégorie.'
            );
          }

        });
    }
  }

  deleteCategory(category: Category): void {

    const confirmed = confirm(
      `Voulez-vous vraiment supprimer la catégorie "${category.nom}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    this.categoryService
      .deleteCategory(category.id)
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Catégorie supprimée avec succès.'
          );

          this.loadCategories();
        },

        error: (error) => {

          console.error(
            'Erreur suppression catégorie :',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Impossible de supprimer la catégorie.'
          );
        }

      });
  }
}
