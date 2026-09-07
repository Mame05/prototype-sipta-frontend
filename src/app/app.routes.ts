import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'catalogue',
    loadComponent: () =>
      import('./pages/catalogue/catalogue')
        .then(m => m.Catalogue)
  },

   {
    path: 'panier',
    loadComponent: () =>
      import('./pages/panier/panier')
        .then(m => m.Panier)
  },

  {
  path: 'commande',
  loadComponent: () =>
    import('./pages/commande/commande')
      .then(m => m.Commande)
},

{
  path: 'confirmation/:id',
  loadComponent: () =>
    import('./pages/confirmation/confirmation')
      .then(m => m.Confirmation)
},

{
  path: 'produit/:id',
  loadComponent: () =>
    import('./pages/detail-produit/detail-produit')
      .then(m => m.DetailProduit)
},

{
  path: 'admin',
  loadComponent: () =>
    import('./pages/admin/admin')
      .then(m => m.Admin),
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./pages/admin/dashboard/dashboard')
          .then(m => m.Dashboard)
    },
    {
      path: 'categories',
      loadComponent: () =>
        import('./pages/admin/categories/categories')
          .then(m => m.Categories)
    },
    {
      path: 'produits',
      loadComponent: () =>
        import('./pages/admin/produits/produits')
          .then(m => m.Produits)
    },
    {
      path: 'commandes',
      loadComponent: () =>
        import('./pages/admin/commandes/commandes')
          .then(m => m.Commandes)
    }
  ]
},

{
  path: '',
  loadComponent: () =>
    import('./pages/accueil/accueil')
      .then(m => m.Accueil)
}

 // {
  //  path: '',
  //  redirectTo: 'catalogue',
  //  pathMatch: 'full'
  //}
];
