import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  {
    path: 'buscar-mufa',
    loadComponent: () =>
      import('./pages/buscar-mufa/buscar-mufa.page').then(
        (m) => m.BuscarMufaPage
      ),
  },
  {
    path: 'registrar-mufa',
    loadComponent: () =>
      import('./pages/registrar-mufa/registrar-mufa.page').then(
        (m) => m.RegistrarMufaPage
      ),
  },
  {
    path: 'registrar-oc',
    loadComponent: () =>
      import('./pages/registrar-oc/registrar-oc.page').then(
        (m) => m.RegistrarOcPage
      ),
  },
  {
    path: 'registrar-cap',
    loadComponent: () =>
      import('./pages/registrar-cap/registrar-cap.page').then(
        (m) => m.RegistrarCapPage
      ),
  },
  {
    path: 'buscar-cap/:ocId',
    loadComponent: () =>
      import('./pages/buscar-cap/buscar-cap.page').then(
        (m) => m.BuscarCapPage
      ),
  },
  {
    path: 'listar-mufas/:ocId/:capId',
    loadComponent: () =>
      import('./pages/listar-mufas/listar-mufas.page').then(
        (m) => m.ListarMufasPage
      ),
  },
  
  {
    // 🔹 Aquí eliminamos :mufaId para que abra el mapa del CAP
    path: 'mapa-mufas/:ocId/:capId',
    loadComponent: () =>
      import('./mapa-mufas/mapa-mufas.page').then((m) => m.MapaMufasPage),
  },
  {
    path: 'agregar-ruta',
    loadComponent: () =>
      import('./pages/agregar-ruta/agregar-ruta.page').then(
        (m) => m.AgregarRutaPage
      ),
  },
 {
  path: 'mostrar-mufa/:mufaId',
  loadComponent: () => import('./pages/mostrar-mufa/mostrar-mufa.page').then(m => m.MostrarMufaPage)
},
];