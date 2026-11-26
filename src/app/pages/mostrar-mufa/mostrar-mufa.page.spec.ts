import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarMufaPage } from './mostrar-mufa.page';

describe('MostrarMufaPage', () => {
  let component: MostrarMufaPage;
  let fixture: ComponentFixture<MostrarMufaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarMufaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
