/// <reference types="@types/google.maps" />
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MufasService, Mufa } from 'src/app/services/mufas.service';

@Component({
  selector: 'app-mostrar-mufa',
  templateUrl: './mostrar-mufa.page.html',
  styleUrls: ['./mostrar-mufa.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class MostrarMufaPage implements OnInit {
  mufaForm: FormGroup;
  selectedImage: File | null = null;
  ocId!: string;
  capId!: string;
  mufaId!: string;
  fotoUrl?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private mufasService: MufasService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.mufaForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cables: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.ocId = this.route.snapshot.queryParamMap.get('ocId')!;
    this.capId = this.route.snapshot.queryParamMap.get('capId')!;
    this.mufaId = this.route.snapshot.paramMap.get('mufaId')!;

    this.cargarMufa();
  }

  get cables(): FormArray {
    return this.mufaForm.get('cables') as FormArray;
  }

  agregarCable(): void {
    this.cables.push(this.fb.group({
      capacidad: ['', Validators.required],
      lote: ['']
    }));
  }

  eliminarCable(index: number): void {
    this.cables.removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  async cargarMufa() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando mufa...' });
    await loading.present();

    this.mufasService.getMufaById(this.ocId, this.capId, this.mufaId).subscribe(mufa => {
      if (!mufa) {
        loading.dismiss();
        this.mostrarToast('Mufa no encontrada');
        return;
      }

      // Patch form
      this.mufaForm.patchValue({ nombre: mufa.nombre, tipo: mufa.direccion });
      this.fotoUrl = mufa.fotoUrl;

      // Limpiar y cargar cables
      this.cables.clear();
      mufa.cables?.forEach(c => {
        this.cables.push(this.fb.group({
          capacidad: [c.capacidad, Validators.required],
          lote: [c.lote || '']
        }));
      });

      loading.dismiss();
    }, err => {
      loading.dismiss();
      console.error(err);
      this.mostrarToast('Error cargando la mufa');
    });
  }

  async guardarCambios() {
    if (this.mufaForm.invalid) {
      this.mufaForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    try {
      const { nombre, tipo, cables } = this.mufaForm.value;
      const mufaActualizada: Partial<Mufa> = { nombre, direccion: tipo, cables };

      // 🔹 Actualizamos la mufa existente
      await this.mufasService.actualizarMufa(this.ocId, this.capId, this.mufaId, mufaActualizada, this.selectedImage);

      this.mostrarToast('Mufa actualizada con éxito');
    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al guardar cambios');
    } finally {
      loading.dismiss();
    }
  }

  async eliminarMufa() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Mufa',
      message: '¿Estás seguro de eliminar esta mufa?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.mufasService.eliminarMufa(this.ocId, this.capId, this.mufaId);
              this.mostrarToast('Mufa eliminada');
              this.router.navigate(['/mapa-mufas', this.ocId, this.capId]);
            } catch (error) {
              console.error(error);
              this.mostrarToast('Error al eliminar mufa');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }
}