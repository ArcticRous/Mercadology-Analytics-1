import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductividadesComponent } from './productividades.component';

describe('ProductividadesComponent', () => {
  let component: ProductividadesComponent;
  let fixture: ComponentFixture<ProductividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductividadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
