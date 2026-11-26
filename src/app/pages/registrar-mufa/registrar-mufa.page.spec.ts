import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarMufaPage } from './registrar-mufa.page';

describe('RegistrarMufaPage', () => {
  let component: RegistrarMufaPage;
  let fixture: ComponentFixture<RegistrarMufaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarMufaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
