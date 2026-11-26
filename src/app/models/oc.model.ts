// src/app/models/oc.model.ts
import { Cap } from './cap.model';

export interface Oc {
  id?: string;
  nombre: string;
  ubicacion?: string;
  fechaCreacion: Date;
  caps?: Cap[]; // Lista de CAPs asociadas
}