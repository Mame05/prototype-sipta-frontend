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
    path: '',
    redirectTo: 'catalogue',
    pathMatch: 'full'
  }
];
