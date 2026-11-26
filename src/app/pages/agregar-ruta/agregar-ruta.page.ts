import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MufasService, Mufa } from 'src/app/services/mufas.service';
import { OcService } from 'src/app/services/oc.service';
import { CapService } from 'src/app/services/cap.service';

declare var google: any;

@Component({
  selector: 'app-agregar-ruta',
  templateUrl: './agregar-ruta.page.html',
  styleUrls: ['./agregar-ruta.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AgregarRutaPage implements OnInit {

  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  map: any;

  searchAddress: string = '';

  modoAgregarMufa: boolean = false;
  modoTrazar: boolean = false;

  mufas: Mufa[] = [];
  markers: any[] = [];
  polylines: any[] = [];

  constructor(
    private router: Router,
    private mufasService: MufasService,
    private ocService: OcService,
    private capService: CapService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      center: { lat: -33.45, lng: -70.66 }, // Santiago por defecto
      zoom: 14
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Click en el mapa
    this.map.addListener('click', (e: any) => {
      if (this.modoAgregarMufa) {
        this.agregarMufaEnMapa(e.latLng.lat(), e.latLng.lng());
      } else if (this.modoTrazar) {
        this.agregarTrazado(e.latLng.lat(), e.latLng.lng());
      }
    });
  }

  agregarMufaEnMapa(lat: number, lng: number) {
    this.modoAgregarMufa = false;

    this.ngZone.run(() => {
      this.router.navigate(['/registrar-mufa'], {
        queryParams: { lat, lng }
      });
    });
  }

  agregarTrazado(lat: number, lng: number) {
    if (this.polylines.length === 0) {
      const polyline = new google.maps.Polyline({
        path: [{ lat, lng }],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: this.map
      });
      this.polylines.push(polyline);
    } else {
      const path = this.polylines[this.polylines.length - 1].getPath();
      path.push(new google.maps.LatLng(lat, lng));
    }
  }

  eliminarUltimoTrazado() {
    if (this.polylines.length > 0) {
      const polyline = this.polylines.pop();
      polyline.setMap(null);
    }
  }

  buscarDireccion() {
    console.log('Buscar dirección:', this.searchAddress);
    // Aquí podrías implementar Google Maps Geocoding API
  }

}