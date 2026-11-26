import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarMufaPage } from './buscar-mufa.page';

describe('BuscarMufaPage', () => {
  let component: BuscarMufaPage;
  let fixture: ComponentFixture<BuscarMufaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarMufaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
