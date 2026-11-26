import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarCapPage } from './buscar-cap.page';

describe('BuscarCapPage', () => {
  let component: BuscarCapPage;
  let fixture: ComponentFixture<BuscarCapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
