import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/app/firebase.config';
import { AlertController, LoadingController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// Importa aquí tus componentes personalizados si usas standalone
// import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
// import { AppLogoComponent } from 'src/app/components/app-logo/app-logo.component';
// import { AppCustomInputComponent } from 'src/app/components/app-custom-input/app-custom-input.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'], 
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    // AppHeaderComponent,
    // AppLogoComponent,
    // AppCustomInputComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Elimina esto si importas los componentes Angular personalizados
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/menu');
    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message || 'Correo o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register'); // Ajusta la ruta según tu app
  }

  get email() {
  return this.loginForm.get('email');
}

get password() {
  return this.loginForm.get('password');
}
}