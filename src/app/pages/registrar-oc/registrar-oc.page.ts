import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-oc',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './registrar-oc.page.html',
  styleUrls: ['./registrar-oc.page.scss'],
})
export class RegistrarOcPage {
  ocForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {
    this.ocForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async registrarOC() {
    if (this.ocForm.invalid) {
      this.ocForm.markAllAsTouched();
      return;
    }

    const { nombre } = this.ocForm.value;
    const ocRef = collection(this.firestore, 'oc'); // Colección singular 'oc'

    try {
      await addDoc(ocRef, { nombre: nombre.trim() });
      this.ocForm.reset();
      const toast = await this.toastCtrl.create({
        message: 'OC registrada correctamente',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error al registrar OC:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar OC, inténtalo nuevamente',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}