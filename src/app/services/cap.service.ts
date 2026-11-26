import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, query, orderBy, getDocs, CollectionReference } from '@angular/fire/firestore';
import { Cap } from '../models/cap.model';

@Injectable({
  providedIn: 'root'
})
export class CapService {
  constructor(private firestore: Firestore) {}

  getCapsRef(ocId: string): CollectionReference {
    return collection(this.firestore, `oc/${ocId}/caps`) as CollectionReference;
  }

  async addCapToOc(ocId: string, cap: Cap) {
    const capsRef = this.getCapsRef(ocId);
    await addDoc(capsRef, cap);
  }

  async getCapsOrdered(ocId: string): Promise<Cap[]> {
    const capsRef = this.getCapsRef(ocId);
    const q = query(capsRef, orderBy('numeroCap', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cap));
  }
}