import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscomunicadosComponent } from './miscomunicados.component';

describe('MiscomunicadosComponent', () => {
  let component: MiscomunicadosComponent;
  let fixture: ComponentFixture<MiscomunicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscomunicadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscomunicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
