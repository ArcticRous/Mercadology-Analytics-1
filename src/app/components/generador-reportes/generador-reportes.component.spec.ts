import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradorReportesComponent } from './generador-reportes.component';

describe('GeneradorReportesComponent', () => {
  let component: GeneradorReportesComponent;
  let fixture: ComponentFixture<GeneradorReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneradorReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneradorReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
