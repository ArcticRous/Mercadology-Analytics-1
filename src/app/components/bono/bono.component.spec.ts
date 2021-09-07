import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonoComponent } from './bono.component';

describe('BonoComponent', () => {
  let component: BonoComponent;
  let fixture: ComponentFixture<BonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
