import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBonosComponent } from './status-bonos.component';

describe('StatusBonosComponent', () => {
  let component: StatusBonosComponent;
  let fixture: ComponentFixture<StatusBonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusBonosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
