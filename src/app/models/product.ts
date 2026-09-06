export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  stock: number;
  disponible: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  nom: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}