import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Oc } from '../models/oc.model';

@Injectable({
  providedIn: 'root'
})
export class OcService {

  constructor(private firestore: Firestore) {}

 getOCs(): Observable<Oc[]> {
  const ocRef = collection(this.firestore, 'oc');
  const obs = collectionData(ocRef, { idField: 'id' }) as Observable<Oc[]>;
  obs.subscribe(data => console.log('Data en getOCs:', data));
  return obs;
}
}