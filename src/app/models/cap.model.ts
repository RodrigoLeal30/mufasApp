export interface Cap {
  id?: string;          // ID del documento (opcional)
  numeroCap: number;    // Número del CAP, único identificador
  ocId: string;         // ID de la OC a la que pertenece
  descripcion?: string; // Opcional
  fecha?: Date;         // Opcional
}