import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcalendarioComponent } from './showcalendario.component';

describe('CalendarioComponent', () => {
  let component: ShowcalendarioComponent;
  let fixture: ComponentFixture<ShowcalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowcalendarioComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
