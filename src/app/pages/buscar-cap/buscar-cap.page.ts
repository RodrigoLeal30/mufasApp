import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscar-cap',
  templateUrl: './buscar-cap.page.html',
  styleUrls: ['./buscar-cap.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BuscarCapPage implements OnInit {
  private ocIdSubject = new BehaviorSubject<string>('');
  capList$!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const ocId = this.route.snapshot.paramMap.get('ocId')!;
    this.ocIdSubject.next(ocId);

    this.capList$ = this.ocIdSubject.pipe(
      switchMap(ocId => {
        const capsRef = collection(this.firestore, `oc/${ocId}/caps`);
        const q = query(capsRef, orderBy('numeroCap', 'asc'));
        return collectionData(q, { idField: 'id' });
      })
    );
  }

  goToMapaMufas(capId: string) {
    const ocId = this.ocIdSubject.value;
    this.router.navigateByUrl(`/mapa-mufas/${ocId}/${capId}`);
  }
}
