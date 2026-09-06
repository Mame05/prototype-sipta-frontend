import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'catalogue',
    loadComponent: () =>
      import('./pages/catalogue/catalogue')
        .then(m => m.Catalogue)
  },

  {
    path: '',
    redirectTo: 'catalogue',
    pathMatch: 'full'
  }
];
