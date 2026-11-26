// src/app/pages/registrar-cap/registrar-cap.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, query, where, getDocs, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-cap',
  templateUrl: './registrar-cap.page.html',
  styleUrls: ['./registrar-cap.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegistrarCapPage implements OnInit {
  capForm!: FormGroup;
  ocList$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.capForm = this.fb.group({
      ocId: ['', Validators.required],
      numeroCap: ['', [Validators.required, Validators.min(1)]],
    });

    // Obtener lista de OC para selector
    const ocRef = collection(this.firestore, 'oc');  // colección singular
    this.ocList$ = collectionData(ocRef, { idField: 'id' });
  }

  async registrarCap() {
    if (this.capForm.invalid) {
      this.capForm.markAllAsTouched();
      return;
    }

    const { ocId, numeroCap } = this.capForm.value;
    const capsRef = collection(this.firestore, `oc/${ocId}/caps`);

    // Validar que no exista un CAP con el mismo número para la misma OC
    const q = query(capsRef, where('numeroCap', '==', Number(numeroCap)));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const toast = await this.toastCtrl.create({
        message: `Ya existe un CAP con número ${numeroCap} en esta OC.`,
        duration: 3000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    try {
      await addDoc(capsRef, { ocId, numeroCap: Number(numeroCap) });
      this.capForm.reset();
      const toast = await this.toastCtrl.create({
        message: 'CAP registrado correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar CAP',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}