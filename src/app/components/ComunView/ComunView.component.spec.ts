import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunViewComponent } from './ComunView.component';

describe('ComunViewComponent', () => {
  let component: ComunViewComponent;
  let fixture: ComponentFixture<ComunViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
