import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from 'src/app/firebase.config';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  menuItems = [
    { title: 'Home', path: 'home', icon: 'home' },
    { title: 'Buscar Mufa', path: 'buscar-mufa', icon: 'search' },
    { title: 'Registrar Mufa', path: 'registrar-mufa', icon: 'add-circle' },
    { title: 'Registrar OC', path: 'registrar-oc', icon: 'document' },
    { title: 'Registrar CAP', path: 'registrar-cap', icon: 'layers' },
    { title: 'Agregar Ruta', path: 'agregar-ruta', icon: 'map' } // <-- Nuevo
  ];

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async logout() {
    try {
      await signOut(auth);
      this.router.navigateByUrl('/login');
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error al cerrar sesión',
        message: 'Intenta nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }
}
