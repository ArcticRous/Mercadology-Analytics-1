import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaComponent } from './minuta.component';

describe('MinutaComponent', () => {
  let component: MinutaComponent;
  let fixture: ComponentFixture<MinutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
