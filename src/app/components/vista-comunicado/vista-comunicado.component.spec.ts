import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaComunicadoComponent } from './vista-comunicado.component';

describe('VistaComunicadoComponent', () => {
  let component: VistaComunicadoComponent;
  let fixture: ComponentFixture<VistaComunicadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaComunicadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaComunicadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
