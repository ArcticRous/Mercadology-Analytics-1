import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicadoIndividualComponent } from './comunicado-individual.component';

describe('ComunicadoIndividualComponent', () => {
  let component: ComunicadoIndividualComponent;
  let fixture: ComponentFixture<ComunicadoIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunicadoIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicadoIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
