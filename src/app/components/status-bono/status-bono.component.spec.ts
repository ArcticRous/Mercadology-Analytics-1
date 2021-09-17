import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBonoComponent } from './status-bono.component';

describe('StatusBonoComponent', () => {
  let component: StatusBonoComponent;
  let fixture: ComponentFixture<StatusBonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusBonoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
