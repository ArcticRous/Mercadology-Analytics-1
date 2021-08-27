import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutasComponent } from './minutas.component';

describe('MinutasComponent', () => {
  let component: MinutasComponent;
  let fixture: ComponentFixture<MinutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
