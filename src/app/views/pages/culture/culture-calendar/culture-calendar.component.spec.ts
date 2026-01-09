import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultureCalendarComponent } from './culture-calendar.component';

describe('CultureCalendarComponent', () => {
  let component: CultureCalendarComponent;
  let fixture: ComponentFixture<CultureCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CultureCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultureCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
