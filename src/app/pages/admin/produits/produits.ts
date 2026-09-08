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

  // =========================
  // IMAGE DU PRODUIT
  // =========================

  selectedFile: File | null = null;

  imagePreview = signal<string | null>(null);

  uploadingImage = signal(false);

  productForm: FormGroup;

  constructor(
    //private productService: ProductService,
    public productService: ProductService,
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


  // =========================
  // PRODUITS
  // =========================

  loadProducts(): void {

    this.loading.set(true);

    this.productService.getProducts().subscribe({

      next: (data) => {

        this.products.set(data);

        this.loading.set(false);

        console.log(
          'Produits admin :',
          data
        );

      },

      error: (error) => {

        console.error(
          'Erreur produits :',
          error
        );

        this.errorMessage.set(
          'Impossible de récupérer les produits.'
        );

        this.loading.set(false);

      }

    });
  }


  // =========================
  // CATÉGORIES
  // =========================

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


  // =========================
  // SÉLECTION IMAGE
  // =========================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }

    const file =
      input.files[0];


    // Vérifier le type

    if (!file.type.startsWith('image/')) {

      this.errorMessage.set(
        'Veuillez sélectionner une image.'
      );

      return;

    }


    // Vérifier la taille

    if (file.size > 5 * 1024 * 1024) {

      this.errorMessage.set(
        'L’image ne doit pas dépasser 5 Mo.'
      );

      return;

    }


    // Stocker le fichier

    this.selectedFile = file;

    this.errorMessage.set('');


    // Aperçu

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview.set(
        reader.result as string
      );

    };

    reader.readAsDataURL(file);

  }


  // =========================
  // AJOUT
  // =========================

  openAdd(): void {

    this.isEdit.set(false);

    this.selectedId.set(null);

    this.selectedFile = null;

    this.imagePreview.set(null);

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


  // =========================
  // MODIFICATION
  // =========================

  openEdit(product: Product): void {

    this.isEdit.set(true);

    this.selectedId.set(
      product.id
    );

    this.selectedFile = null;


    // Image actuelle

    if (product.image) {

      this.imagePreview.set(
        `http://localhost:3000/uploads/products/${product.image}`
      );

    } else {

      this.imagePreview.set(null);

    }


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


  // =========================
  // FERMER FORMULAIRE
  // =========================

  closeForm(): void {

    this.showForm.set(false);

    this.productForm.reset();

    this.selectedId.set(null);

    this.selectedFile = null;

    this.imagePreview.set(null);

    this.successMessage.set('');

    this.errorMessage.set('');

  }


  // =========================
  // SAUVEGARDER
  // =========================

  saveProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    this.successMessage.set('');

    this.errorMessage.set('');


    // =========================
    // DONNÉES DU PRODUIT
    // =========================

    const buildProductData = (
      imageName: string
    ) => {

      return {

        nom:
          this.productForm.value.nom,

        description:
          this.productForm.value.description || '',

        prix:
          Number(
            this.productForm.value.prix
          ),

        image:
          imageName,

        stock:
          Number(
            this.productForm.value.stock
          ),

        disponible:
          this.productForm.value.disponible,

        categoryId:
          Number(
            this.productForm.value.categoryId
          )

      };

    };


    // =========================
    // MODIFICATION
    // =========================

    if (this.isEdit()) {

      const id =
        this.selectedId();


      if (!id) {

        return;

      }


      // Si une nouvelle image est sélectionnée
      if (this.selectedFile) {

        this.uploadingImage.set(true);

        this.productService
          .uploadImage(this.selectedFile)
          .subscribe({

            next: (response) => {

              this.uploadingImage.set(false);

              const data =
                buildProductData(
                  response.image
                );

              this.updateProduct(
                id,
                data
              );

            },

            error: (error) => {

              console.error(
                'Erreur upload image :',
                error
              );

              this.uploadingImage.set(false);

              this.errorMessage.set(
                'Impossible d’uploader l’image.'
              );

            }

          });

      } else {

        // Garder l'image actuelle

        const data =
          buildProductData(
            this.productForm.value.image || ''
          );

        this.updateProduct(
          id,
          data
        );

      }

      return;

    }


    // =========================
    // AJOUT
    // =========================

    if (!this.selectedFile) {

      this.errorMessage.set(
        'Veuillez sélectionner une image.'
      );

      return;

    }


    this.uploadingImage.set(true);


    // 1. Upload image

    this.productService
      .uploadImage(this.selectedFile)
      .subscribe({

        next: (response) => {

          console.log(
            'Image uploadée :',
            response
          );


          this.uploadingImage.set(false);


          // 2. Créer le produit

          const data =
            buildProductData(
              response.image
            );


          this.productService
            .createProduct(data)
            .subscribe({

              next: (product) => {

                console.log(
                  'Produit créé :',
                  product
                );

                this.successMessage.set(
                  'Produit ajouté avec succès.'
                );

                this.showForm.set(false);

                this.selectedFile = null;

                this.imagePreview.set(null);

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

        },

        error: (error) => {

          console.error(
            'Erreur upload image :',
            error
          );

          this.uploadingImage.set(false);

          this.errorMessage.set(
            'Impossible d’uploader l’image.'
          );

        }

      });

  }


  // =========================
  // MODIFIER LE PRODUIT
  // =========================

  updateProduct(
    id: number,
    data: any
  ): void {

    this.productService
      .updateProduct(
        id,
        data
      )
      .subscribe({

        next: (product) => {

          console.log(
            'Produit modifié :',
            product
          );

          this.successMessage.set(
            'Produit modifié avec succès.'
          );

          this.showForm.set(false);

          this.selectedFile = null;

          this.imagePreview.set(null);

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

  }


  // =========================
  // SUPPRIMER
  // =========================

  deleteProduct(
    product: Product
  ): void {

    const confirmed =
      confirm(
        `Voulez-vous vraiment supprimer le produit "${product.nom}" ?`
      );

    if (!confirmed) {

      return;

    }


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

