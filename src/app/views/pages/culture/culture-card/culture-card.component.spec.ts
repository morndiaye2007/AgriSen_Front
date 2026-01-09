import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultureCardComponent } from './culture-card.component';

describe('CultureCardComponent', () => {
  let component: CultureCardComponent;
  let fixture: ComponentFixture<CultureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CultureCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
