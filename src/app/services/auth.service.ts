import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from 'src/app/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  /**
   * Inicia sesión con email y contraseña
   */
  login(email: string, password: string): Promise<import("firebase/auth").UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Registra un nuevo usuario con email y contraseña
   */
  register(email: string, password: string): Promise<import("firebase/auth").UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): Promise<void> {
    return signOut(auth);
  }

  /**
   * Obtiene el usuario actualmente autenticado
   */
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });
  }
}