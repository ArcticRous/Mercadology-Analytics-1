import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductividadUsuarioComponent } from './productividad-usuario.component';

describe('ProductividadUsuarioComponent', () => {
  let component: ProductividadUsuarioComponent;
  let fixture: ComponentFixture<ProductividadUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductividadUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductividadUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
