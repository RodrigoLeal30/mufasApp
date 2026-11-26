/// <reference types="@types/google.maps" />
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MufasService, Mufa } from 'src/app/services/mufas.service';

@Component({
  selector: 'app-registrar-mufa',
  templateUrl: './registrar-mufa.page.html',
  styleUrls: ['./registrar-mufa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RegistrarMufaPage implements OnInit {
  mufaForm: FormGroup;
  selectedImage: File | null = null;
  lat!: number;
  lng!: number;
  ocId!: string;
  capId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mufasService: MufasService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.mufaForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['Aérea', Validators.required],
      cables: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.lat = +params['lat'];
      this.lng = +params['lng'];
      this.ocId = params['ocId'];
      this.capId = params['capId'];
    });
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

  async registrarMufa(): Promise<void> {
    if (this.mufaForm.invalid) {
      this.mufaForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingController.create({ message: 'Registrando mufa...' });
    await loading.present();

    try {
      const { nombre, tipo, cables } = this.mufaForm.value;

      const nuevaMufa: Mufa = {
        nombre,
        direccion: tipo,
        cables,
        lat: this.lat,
        lng: this.lng
      };

      await this.mufasService.agregarMufa(this.ocId, this.capId, nuevaMufa, this.selectedImage);

      this.mostrarToast('Mufa registrada con éxito');
      this.mufaForm.reset({ tipo: 'Aérea' });
      this.cables.clear();
      this.selectedImage = null;
    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al registrar mufa.');
    } finally {
      loading.dismiss();
    }
  }

  private async mostrarToast(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }
}
