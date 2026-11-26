import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarCapPage } from './registrar-cap.page';

describe('RegistrarCapPage', () => {
  let component: RegistrarCapPage;
  let fixture: ComponentFixture<RegistrarCapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
