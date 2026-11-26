import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Cable {
  capacidad: number;
  lote?: string;
}

export interface Mufa {
  id?: string;
  nombre: string;
  direccion: string;
  cables: Cable[];
  fotoUrl?: string;
  lat?: number;
  lng?: number;
}

export interface Traza {
  id?: string;
  coords: { lat: number; lng: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MufasService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  // ------------------ Mufas ------------------
  async agregarMufa(
    ocId: string,
    capId: string,
    mufa: Mufa,
    imagen?: File | null
  ): Promise<Mufa> {
    try {
      const mufasCollection = collection(this.firestore, `oc/${ocId}/caps/${capId}/mufas`);
      const docRef = await addDoc(mufasCollection, mufa);

      let url: string | undefined;
      if (imagen) {
        const ruta = `mufas/${docRef.id}/foto.jpg`;
        const imageRef = ref(this.storage, ruta);

        await uploadBytes(imageRef, imagen);
        url = await getDownloadURL(imageRef);

        const mufaDoc = doc(this.firestore, `oc/${ocId}/caps/${capId}/mufas/${docRef.id}`);
        await updateDoc(mufaDoc, { fotoUrl: url });
      }

      return { ...mufa, id: docRef.id, fotoUrl: url };
    } catch (error) {
      console.error('Error al agregar mufa:', error);
      throw error;
    }
  }

  async actualizarMufa(
    ocId: string,
    capId: string,
    mufaId: string,
    data: Partial<Mufa>,
    imagen?: File | null
  ): Promise<void> {
    try {
      const mufaDoc = doc(this.firestore, `oc/${ocId}/caps/${capId}/mufas/${mufaId}`);

      let updateData: Partial<Mufa> = { ...data };

      if (imagen) {
        const ruta = `mufas/${mufaId}/foto.jpg`;
        const imageRef = ref(this.storage, ruta);

        await uploadBytes(imageRef, imagen);
        const url = await getDownloadURL(imageRef);

        updateData.fotoUrl = url;
      }

      await updateDoc(mufaDoc, updateData);
    } catch (error) {
      console.error('Error al actualizar mufa:', error);
      throw error;
    }
  }

  obtenerMufas(ocId: string, capId: string): Observable<Mufa[]> {
    const mufasCollection = collection(this.firestore, `oc/${ocId}/caps/${capId}/mufas`);
    return collectionData(mufasCollection, { idField: 'id' }) as Observable<Mufa[]>;
  }

  async eliminarMufa(ocId: string, capId: string, mufaId: string) {
    const mufaDoc = doc(this.firestore, `oc/${ocId}/caps/${capId}/mufas/${mufaId}`);
    await deleteDoc(mufaDoc);
  }

  getMufaById(ocId: string, capId: string, mufaId: string): Observable<Mufa> {
    const docRef = doc(this.firestore, `oc/${ocId}/caps/${capId}/mufas/${mufaId}`);
    return docData(docRef, { idField: 'id' }) as Observable<Mufa>;
  }

  // ------------------ Trazas ------------------
  async agregarTraza(ocId: string, capId: string, traza: Traza) {
    const trazasCollection = collection(this.firestore, `oc/${ocId}/caps/${capId}/trazas`);
    return addDoc(trazasCollection, traza);
  }

  async actualizarTraza(ocId: string, capId: string, trazaId: string, coords: { lat: number; lng: number }[]) {
    const trazaDoc = doc(this.firestore, `oc/${ocId}/caps/${capId}/trazas/${trazaId}`);
    await updateDoc(trazaDoc, { coords });
  }

  obtenerTrazas(ocId: string, capId: string): Observable<Traza[]> {
    const trazasCollection = collection(this.firestore, `oc/${ocId}/caps/${capId}/trazas`);
    return collectionData(trazasCollection, { idField: 'id' }) as Observable<Traza[]>;
  }

  async eliminarTraza(ocId: string, capId: string, trazaId: string) {
    const trazaDoc = doc(this.firestore, `oc/${ocId}/caps/${capId}/trazas/${trazaId}`);
    await deleteDoc(trazaDoc);
  }
}