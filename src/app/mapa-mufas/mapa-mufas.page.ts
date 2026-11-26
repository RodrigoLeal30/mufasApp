/// <reference types="@types/google.maps" />
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { MufasService, Mufa } from '../services/mufas.service';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-mapa-mufas',
  templateUrl: './mapa-mufas.page.html',
  styleUrls: ['./mapa-mufas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MapaMufasPage implements OnInit, OnDestroy {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;

  map!: google.maps.Map;
  modoAgregarMufa = false;
  modoTrazarRuta = false;

  ocId!: string;
  capId!: string;

  private mufasSub?: Subscription;
  private trazasSub?: Subscription;
  private markers: google.maps.Marker[] = [];

  private rutaPath!: google.maps.Polyline;
  private rutaCoords: google.maps.LatLngLiteral[] = [];
  private trazaDocId?: string;

  private todasLasTrazas: google.maps.Polyline[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mufasService: MufasService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.ocId = this.route.snapshot.paramMap.get('ocId')!;
    this.capId = this.route.snapshot.paramMap.get('capId')!;

    const mapOptions = {
      center: { lat: -33.4489, lng: -70.6693 },
      zoom: 14
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.rutaPath = new google.maps.Polyline({
      path: this.rutaCoords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });

    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (this.modoAgregarMufa) this.colocarMufa(lat, lng);
      if (this.modoTrazarRuta) this.agregarPuntoRuta(lat, lng);
    });

    this.cargarMufas();
    this.cargarTrazas();
  }

  ngOnDestroy() {
    this.mufasSub?.unsubscribe();
    this.trazasSub?.unsubscribe();
  }

  activarAgregarMufa() {
    this.modoAgregarMufa = true;
    this.modoTrazarRuta = false;
  }

  activarTrazarRuta() {
    this.modoAgregarMufa = false;
    this.modoTrazarRuta = true;
  }

  borrarUltimaTraza() {
    if (this.rutaCoords.length > 0) {
      this.rutaCoords.pop();
      this.rutaPath.setPath(this.rutaCoords);

      if (this.trazaDocId) {
        this.mufasService.actualizarTraza(this.ocId, this.capId, this.trazaDocId, this.rutaCoords);
      }
    }
  }

  colocarMufa(lat: number, lng: number) {
    this.router.navigate(['/registrar-mufa'], {
      queryParams: { lat, lng, ocId: this.ocId, capId: this.capId }
    });
  }

  agregarPuntoRuta(lat: number, lng: number) {
    this.rutaCoords.push({ lat, lng });
    this.rutaPath.setPath(this.rutaCoords);

    if (!this.trazaDocId) {
      this.mufasService.agregarTraza(this.ocId, this.capId, { coords: this.rutaCoords })
        .then(docRef => this.trazaDocId = docRef.id);
    } else {
      this.mufasService.actualizarTraza(this.ocId, this.capId, this.trazaDocId, this.rutaCoords);
    }
  }

  async finalizarRuta() {
    if (!this.trazaDocId || this.rutaCoords.length === 0) return;

    this.mufasService.actualizarTraza(this.ocId, this.capId, this.trazaDocId, this.rutaCoords);

    this.todasLasTrazas.push(this.rutaPath);

    this.modoTrazarRuta = false;
    this.rutaCoords = [];
    this.trazaDocId = undefined;

    this.rutaPath = new google.maps.Polyline({
      path: this.rutaCoords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });
  }

  private cargarMufas() {
    this.mufasSub = this.mufasService.obtenerMufas(this.ocId, this.capId)
      .subscribe((mufas: Mufa[]) => {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];

        mufas.forEach(mufa => {
          if (!mufa.lat || !mufa.lng) return;

          const marker = new google.maps.Marker({
            position: { lat: mufa.lat, lng: mufa.lng },
            map: this.map,
            title: mufa.nombre,
            icon: {
              url: 'assets/mufa.PNG',
              scaledSize: new google.maps.Size(60, 32),
              labelOrigin: new google.maps.Point(30, 16)
            },
            label: {
              text: mufa.nombre,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            }
          });

          marker.addListener('click', () => {
            this.router.navigate(['/mostrar-mufa', mufa.id], {
              queryParams: { ocId: this.ocId, capId: this.capId }
            });
          });

          this.markers.push(marker);
        });
      });
  }

  private cargarTrazas() {
    this.trazasSub = this.mufasService.obtenerTrazas(this.ocId, this.capId)
      .subscribe(data => {
        this.todasLasTrazas.forEach(poly => poly.setMap(null));
        this.todasLasTrazas = [];

        data.forEach(traza => {
          const polyline = new google.maps.Polyline({
            path: traza.coords || [],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: this.map
          });

          this.todasLasTrazas.push(polyline);

          polyline.addListener('click', async () => {
            const alert = await this.alertCtrl.create({
              header: 'Eliminar traza',
              message: '¿Quieres eliminar esta traza?',
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Eliminar',
                  role: 'destructive',
                  handler: async () => {
                    if (traza.id) {
                      this.mufasService.eliminarTraza(this.ocId, this.capId, traza.id);
                      polyline.setMap(null);
                      this.todasLasTrazas = this.todasLasTrazas.filter(p => p !== polyline);
                    }
                  }
                }
              ]
            });
            await alert.present();
          });
        });

        const ultima = data.find(d => d.id === this.trazaDocId);
        if (ultima) {
          this.rutaCoords = ultima.coords || [];
          this.rutaPath.setPath(this.rutaCoords);
        }
      });
  }
}