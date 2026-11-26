import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaMufasPage } from './mapa-mufas.page';

describe('MapaMufasPage', () => {
  let component: MapaMufasPage;
  let fixture: ComponentFixture<MapaMufasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaMufasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
