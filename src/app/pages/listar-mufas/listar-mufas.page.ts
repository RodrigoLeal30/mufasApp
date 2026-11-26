import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MufasService, Mufa } from 'src/app/services/mufas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listar-mufas',
  templateUrl: './listar-mufas.page.html',
  styleUrls: ['./listar-mufas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ListarMufasPage implements OnInit {
  ocId = '';
  capId = '';
  mufas: Mufa[] = [];

  constructor(
    private mufasService: MufasService,
    private toastController: ToastController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ocId = params.get('ocId') ?? '';
      this.capId = params.get('capId') ?? '';

      if (this.ocId && this.capId) {
        this.cargarMufas(this.ocId, this.capId);
      } else {
        this.mostrarToast('No se recibieron parámetros para cargar mufas');
      }
    });
  }

  cargarMufas(ocId: string, capId: string): void {
    this.mufasService.obtenerMufas(ocId, capId).subscribe({
      next: (mufas) => {
        this.mufas = mufas;
      },
      error: (err) => {
        console.error('Error cargando mufas:', err);
        this.mostrarToast('Error cargando mufas');
      }
    });
  }

  verDetalle(mufaId?: string) {
    if (!mufaId) {
      this.mostrarToast('ID de mufa inválido');
      return;
    }
    this.router.navigate(['/detalle-mufa', this.ocId, this.capId, mufaId]);
  }

  editarMufa(mufa: Mufa) {
    if (!mufa.id) {
      this.mostrarToast('ID de mufa inválido');
      return;
    }
    this.router.navigate(['/editar-mufa', this.ocId, this.capId, mufa.id]);
  }

  async eliminarMufa(mufaId?: string) {
    if (!mufaId) {
      this.mostrarToast('ID de mufa inválido');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar esta mufa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          cssClass: 'alert-button-danger',
          handler: async () => {
            try {
              await this.mufasService.eliminarMufa(this.ocId, this.capId, mufaId);
              this.mostrarToast('Mufa eliminada');
              this.cargarMufas(this.ocId, this.capId);
            } catch (error) {
              console.error('Error al eliminar mufa:', error);
              this.mostrarToast('Error eliminando mufa');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}