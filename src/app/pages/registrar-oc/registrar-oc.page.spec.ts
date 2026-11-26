import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarOcPage } from './registrar-oc.page';

describe('RegistrarOcPage', () => {
  let component: RegistrarOcPage;
  let fixture: ComponentFixture<RegistrarOcPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarOcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
