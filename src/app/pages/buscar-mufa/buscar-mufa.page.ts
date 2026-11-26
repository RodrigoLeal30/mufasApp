import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-buscar-mufa',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  templateUrl: './buscar-mufa.page.html',
  styleUrls: ['./buscar-mufa.page.scss'],
})
export class BuscarMufaPage implements OnInit {
  ocList$!: Observable<any[]>;

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const ocRef = collection(this.firestore, 'oc');
    this.ocList$ = collectionData(ocRef, { idField: 'id' });
  }

 goToOC(ocId: string) {
  this.router.navigateByUrl(`/buscar-cap/${ocId}`);
}
}
