import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarMufasPage } from './listar-mufas.page';

describe('ListarMufasPage', () => {
  let component: ListarMufasPage;
  let fixture: ComponentFixture<ListarMufasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarMufasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
